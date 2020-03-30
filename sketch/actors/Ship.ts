/// <reference path="../base/SpriteMover.ts"/>
/// <reference path="Bullet.ts"/>

const enum BulletSpawnPosition {
  TOP,
  BOTTOM
}

interface ShipConfig extends SpriteMoverConfig {
  bulletVelocity: p5.Vector
  bulletsSpawnFrom: BulletSpawnPosition
  bulletTextOptions: string[]
  bulletFont: p5.Font
  bulletsPerShot: number
  hitPoints: number
  customLaserSound: p5.SoundFile
}

class Ship extends SpriteMover {
  private leftForce = createVector(-0.4, 0)
  private rightForce = createVector(0.4, 0)

  protected bulletVelocity: p5.Vector
  protected bulletsSpawnFrom: BulletSpawnPosition
  protected bulletTextOptions: string[]
  protected bulletFont: p5.Font
  bulletsPerShot: number
  hitPoints: number
  damage = 1

  laserSound: p5.SoundFile

  bullets: Bullet[] = []

  constructor({
    bulletFont,
    bulletTextOptions,
    bulletVelocity,
    bulletsSpawnFrom,
    bulletsPerShot,
    hitPoints,
    customLaserSound = laserSound,
    ...config
  }: ShipConfig) {
    super(config)
    this.bulletVelocity = bulletVelocity
    this.bulletsSpawnFrom = bulletsSpawnFrom
    this.bulletFont = bulletFont
    this.bulletTextOptions = bulletTextOptions
    this.bulletsPerShot = bulletsPerShot
    this.hitPoints = hitPoints
    this.laserSound = customLaserSound
  }

  moveLeft() {
    return this.applyForce(this.leftForce)
  }

  moveRight() {
    return this.applyForce(this.rightForce)
  }

  update() {
    super.update()

    this.bullets = this.bullets.filter(x => x.active).map(x => x.update())

    return this
  }

  draw() {
    super.draw()
    // rectMode(CORNER)
    // stroke(255, 100, 100)
    // noFill()
    // rect(this.pos.x, this.pos.y, this.width, this.height)

    this.bullets.forEach((x, i) => {
      x.draw()
    })

    return this
  }

  shoot() {
    if (!this.isOffScreen) {
      this.laserSound.play()
    }
    const bulletText = random(this.bulletTextOptions)
    let radiusPerShot = HALF_PI / (this.bulletsPerShot - 1)
    push()

    for (let i = 0; i < this.bulletsPerShot; i++) {
      const bulletPosition = this.pos.copy().add(this.width / 2)
      if (this.bulletsSpawnFrom === BulletSpawnPosition.BOTTOM) {
        bulletPosition.set(bulletPosition.x, this.bottom)
      }

      const bulletVelocity = this.bulletVelocity.copy()

      if (this.bulletsPerShot > 1) {
        bulletVelocity.rotate(radiusPerShot * i - HALF_PI / 2)
      }

      const bullet = new Bullet({
        pos: bulletPosition,
        vel: bulletVelocity,
        height: 15,
        width: 5,
        text: bulletText,
        font: this.bulletFont
      })

      this.bullets.push(bullet)
    }
    pop()
  }

  checkBulletCollision(object: Mover) {
    return this.bullets.find(bullet => object.checkCollision(bullet))
  }
}
