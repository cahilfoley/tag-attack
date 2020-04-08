/// <reference path="Ship.ts"/>

class PlayerShip extends Ship {
  dragForce = 0.03

  constructor(config: MoverConfig) {
    super({
      ...config,
      spritePath: './images/player.png',
      bulletVelocity: createVector(0, -10),
      bulletsSpawnFrom: BulletSpawnPosition.TOP,
      bulletFont: titleFont,
      bulletTextOptions: playerBullets,
      customLaserSound: playerLaserSound,
      bulletsPerShot: 1,
      hitPoints: 1
    })

    this.vel.limit(1)
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
}
