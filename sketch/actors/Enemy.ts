/// <reference path="Ship.ts"/>

interface EnemyConfig extends MoverConfig {
  name: string
  score: number
  bulletsPerShot: number
  hitPoints: number
  fireRate: number
  spritePath: string
}

class Enemy extends Ship {
  nextShotAtFrame = Math.floor(random(150))
  nextDirectionChangeAtFrame = Math.floor(random(400))
  name: string
  score: number
  fireRate: number

  constructor({ name, score, fireRate, spritePath, ...config }: EnemyConfig) {
    super({
      ...config,
      spritePath,
      bulletVelocity: createVector(0, 10),
      bulletsSpawnFrom: BulletSpawnPosition.BOTTOM,
      bulletFont: regularFont,
      bulletTextOptions: enemyBullets,
      customLaserSound: laserSound
    })

    this.name = name
    this.score = score
    this.fireRate = fireRate
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
  }

  draw() {
    super.draw()

    textSize(16)
    noStroke()
    textFont(regularFont)
    fill(255)
    text(this.name.toUpperCase(), this.left + this.width / 2, this.bottom + 16)

    return this
  }
}
