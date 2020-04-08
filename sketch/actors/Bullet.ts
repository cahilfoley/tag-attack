/// <reference path="../base/SpriteMover.ts"/>

class Bullet extends SpriteMover {
  private static getSpriteImage() {
    return random(tetrisImages)
  }

  constructor(config: MoverConfig) {
    super({ ...config, sprite: Bullet.getSpriteImage() })
  }

  /** Flag bullets for deletion after moving off screen */
  protected move() {
    super.move()

    if (this.isOffScreen) {
      this.active = false
    }

    return this
  }

  draw() {
    push()

    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading())
    rotate(PI / 2)
    super.draw({ x: 0, y: 0 })

    pop()
    return this
  }
}
