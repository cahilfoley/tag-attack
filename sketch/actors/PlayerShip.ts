/// <reference path="Ship.ts"/>

class PlayerShip extends Ship {
  dragForce = 0.03
  minFramesBetweenShots = 10

  lastShot = 0

  constructor(config: MoverConfig) {
    super({
      ...config,
      sprite: playerShip,
      bulletVelocity: createVector(0, -10),
      bulletsSpawnFrom: BulletSpawnPosition.TOP,
      customLaserSound: playerLaserSound,
      bulletsPerShot: 5,
      hitPoints: 1,
    })

    this.vel.limit(1)
  }

  shoot() {
    if (frameCount - this.lastShot > this.minFramesBetweenShots) {
      super.shoot()
      this.lastShot = frameCount
    }
    return this
  }

  protected move() {
    super.move()

    // Apply some drag force
    this.vel.mult(1 - this.dragForce)

    // Bounce off the edges
    if (this.left < 0 || this.right > windowWidth) {
      this.vel.x = -this.vel.x
      this.pos.x += this.vel.x
    }

    if (this.top < 0 || this.bottom > windowHeight) {
      this.vel.y = -this.vel.y
      this.pos.y += this.vel.y
    }

    return this
  }

  draw() {
    if (frameCount - this.lastShot < 10) {
      super.draw({ sprite: playerShipShooting })
    } else {
      super.draw()
    }
    return this
  }
}
