/// <reference path="Mover.ts"/>

interface SpriteMoverConfig extends MoverConfig {
  spritePath: string
}

/** A subclass of Mover that renders an image for it's draw function */
class SpriteMover extends Mover {
  protected sprite: p5.Image

  constructor({ spritePath, ...config }: SpriteMoverConfig) {
    super(config)
    this.sprite = loadImage(spritePath)
  }

  draw() {
    image(this.sprite, this.pos.x, this.pos.y, this.width, this.height)

    return this
  }
}
