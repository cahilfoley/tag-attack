/// <reference path="../Ship.ts"/>

/** Used in derived classes for constructor props */
interface EnemyProps {
  vel: p5.Vector
  pos: p5.Vector
}

interface EnemyConfig extends MoverConfig {
  name: string
  score: number
  bulletsPerShot: number
  hitPoints: number
  fireRate: number
  sprite: p5.Image
  /** Children will spawn from the enemy when it explodes */
  children?: Enemy[]
}

class Enemy extends Ship {
  nextShotAtFrame = Math.floor(random(150))
  nextDirectionChangeAtFrame = Math.floor(random(400))
  name: string
  score: number
  fireRate: number
  children?: Enemy[]

  constructor({
    name,
    score,
    fireRate,
    sprite,
    children,
    ...config
  }: EnemyConfig) {
    super({
      ...config,
      sprite,
      bulletVelocity: createVector(0, 10),
      bulletsSpawnFrom: BulletSpawnPosition.BOTTOM,
      customLaserSound: laserSound,
    })

    this.name = name
    this.score = score
    this.fireRate = fireRate
    this.children = children
  }

  protected move() {
    super.move()

    if (this.right > windowWidth - 10) {
      this.vel.set(-2, this.vel.y)
    } else if (this.left < 10) {
      this.vel.set(2, this.vel.y)
    }

    return this
  }

  update() {
    super.update()

    if (this.top > windowHeight) {
      this.active = false
    }

    if (frameCount >= this.nextShotAtFrame && !this.isOffScreen) {
      this.shoot()
      this.nextShotAtFrame = frameCount + random(500 / this.fireRate)
    }

    if (frameCount >= this.nextDirectionChangeAtFrame) {
      this.vel = createVector(random(-1, 1), random(0.5, 2))
      this.nextDirectionChangeAtFrame = frameCount + random(400)
    }

    return this
  }

  explode() {
    smallExplosion.play()

    if (this.children) {
      enemies.push(...this.children)
    }
  }

  draw() {
    super.draw()

    textSize(16)
    noStroke()
    textFont(regularFont)
    fill(255)
    text(this.name.toUpperCase(), this.left + this.width / 2, this.bottom + 16)

    const sectionWidth = this.width / this.maxHitPoints
    const healthPercentage = this.hitPoints / this.maxHitPoints
    if (healthPercentage > 0.5) {
      fill(100, 255, 100, 150)
    } else {
      fill(255, 0, 0, 150)
    }
    for (let i = 0; i < this.hitPoints; i++) {
      rect(this.left + sectionWidth * i, this.top - 10, sectionWidth - 2, 4)
    }

    return this
  }
}
