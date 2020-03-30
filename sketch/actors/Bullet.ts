/// <reference path="../base/SpriteMover.ts"/>

interface BulletConfig extends MoverConfig {
  font: p5.Font
  text: string
}

class Bullet extends SpriteMover {
  protected font: p5.Font
  text: string

  constructor({ font, text, ...config }: BulletConfig) {
    super({ ...config, spritePath: './images/bullet.png' })
    this.font = font
    this.text = text
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

    fill(255)
    textFont(this.font)
    textSize(16)
    text(this.text, 0, 0)
    pop()

    return this
  }
}
