/// <reference path="Ship.ts"/>

class PlayerShip extends Ship {
  dragForce = 0.03

  lastShot = 0

  constructor(config: MoverConfig) {
    super({
      ...config,
      sprite: playerShip,
      bulletVelocity: createVector(0, -10),
      bulletsSpawnFrom: BulletSpawnPosition.TOP,
      customLaserSound: playerLaserSound,
      bulletsPerShot: 1,
      hitPoints: 1,
    })

    this.vel.limit(1)
  }

  shoot() {
    super.shoot()
    this.lastShot = frameCount
    return this
  }

  protected move() {
    super.move()

    // Apply some drag force
    this.vel.mult(1 - this.dragForce)

    // Bounce off the edges
    if (this.left < 0 || this.right > windowWidth) {
      this.vel.mult(-1)
      this.pos.add(this.vel)
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
