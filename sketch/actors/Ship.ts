/// <reference path="../base/SpriteMover.ts"/>
/// <reference path="Bullet.ts"/>

const enum BulletSpawnPosition {
  TOP,
  BOTTOM,
}

interface ShipConfig extends SpriteMoverConfig {
  bulletVelocity: p5.Vector
  bulletsSpawnFrom: BulletSpawnPosition
  bulletsPerShot: number
  hitPoints: number
  customLaserSound: p5.SoundFile
}

class Ship extends SpriteMover {
  private upForce = createVector(0, -0.4)
  private leftForce = createVector(-0.4, 0)
  private downForce = createVector(0, 0.4)
  private rightForce = createVector(0.4, 0)

  protected bulletVelocity: p5.Vector
  protected bulletsSpawnFrom: BulletSpawnPosition
  bulletsPerShot: number
  hitPoints: number
  maxHitPoints: number
  damage = 1

  laserSound: p5.SoundFile

  bullets: Bullet[] = []

  constructor({
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
    this.bulletsPerShot = bulletsPerShot
    this.hitPoints = hitPoints
    this.maxHitPoints = hitPoints
    this.laserSound = customLaserSound
  }
  moveUp() {
    return this.applyForce(this.upForce)
  }

  moveLeft() {
    return this.applyForce(this.leftForce)
  }

  moveDown() {
    return this.applyForce(this.downForce)
  }

  moveRight() {
    return this.applyForce(this.rightForce)
  }

  update() {
    super.update()

    this.bullets = this.bullets.filter((x) => x.active).map((x) => x.update())

    return this
  }

  draw(...args: any[]) {
    super.draw(...args)

    this.bullets.forEach((x) => x.draw())

    return this
  }

  shoot() {
    if (!this.isOffScreen) {
      this.laserSound.play()
    }
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
        height: 40,
        width: 20,
      })

      this.bullets.push(bullet)
    }
    pop()
  }

  checkBulletCollision(object: Mover) {
    return this.bullets.find((bullet) => object.checkCollision(bullet))
  }
}
