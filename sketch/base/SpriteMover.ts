/// <reference path="Mover.ts"/>

interface SpriteMoverConfig extends MoverConfig {
  spritePath?: string
  sprite?: p5.Image
}

/** A subclass of Mover that renders an image for it's draw function */
class SpriteMover extends Mover {
  protected sprite: p5.Image

  constructor({ spritePath, sprite, ...config }: SpriteMoverConfig) {
    super(config)
    this.sprite = sprite || (spritePath && loadImage(spritePath))
  }

  draw({ x = this.pos.x, y = this.pos.y, sprite = this.sprite } = {}) {
    image(sprite, x, y, this.width, this.height)

    // noFill()
    // stroke(255, 0, 0)
    // rect(this.left, this.top, this.width, this.height)

    return this
  }
}
