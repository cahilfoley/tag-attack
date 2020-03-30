interface MoverConfig {
  pos: p5.Vector
  height: number
  width: number
  vel?: p5.Vector
}

abstract class Mover {
  /** Tells the sketch to remove the object if it is false */
  active = true

  width: number
  height: number

  pos: p5.Vector
  vel: p5.Vector
  acc: p5.Vector

  constructor({ pos, height, width, vel }: MoverConfig) {
    this.pos = pos
    this.vel = vel || createVector()
    this.acc = createVector()
    this.height = height
    this.width = width
  }

  get isOffScreen() {
    return (
      this.right < 0 ||
      this.left > windowWidth ||
      this.bottom < 0 ||
      this.top > windowHeight
    )
  }

  get left() {
    return this.pos.x
  }

  get right() {
    return this.left + this.width
  }

  get top() {
    return this.pos.y
  }

  get bottom() {
    return this.top + this.height
  }

  checkCollision(object: Mover) {
    return (
      object.right > this.left &&
      object.left < this.right &&
      object.bottom > this.top &&
      object.top < this.bottom
    )
  }

  applyForce(force: p5.Vector) {
    this.acc.add(force)

    return this
  }

  protected move() {
    this.vel.add(this.acc)
    this.acc.mult(0)
    this.pos.add(this.vel)

    return this
  }

  update() {
    this.move()

    return this
  }

  abstract draw(): this
}
