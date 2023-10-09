export type Vector = { x: number; y: number }

export type Position = Vector
export type Velocity = Vector
export type Size = Vector

export class Rigid {
  position: Position
  velocity: Velocity
  size: Size
  weight: number

  constructor(pos: Position, vel: Velocity, size: Size) {
    this.position = pos
    this.velocity = vel
    this.size = size
    this.weight = 0
  }

  update(..._args: any[]): void {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y += this.weight
  }

  isColliding(other: Rigid): "x collision" | "y collision" | "no collision" {
    const newPosition: Position = { x: this.position.x + this.velocity.x, y: this.position.y + this.velocity.y }
    const newOtherPosition: Position = {
      x: other.position.x + other.velocity.x,
      y: other.position.y + other.velocity.y,
    }
    if (
      newPosition.x < newOtherPosition.x + other.size.x &&
      newPosition.x + this.size.x > newOtherPosition.x &&
      this.position.y < other.position.y + other.size.y &&
      this.position.y + this.size.y > other.position.y
    ) {
      return "x collision"
    } else if (
      this.position.x < other.position.x + other.size.x &&
      this.position.x + this.size.x > other.position.x &&
      newPosition.y < newOtherPosition.y + other.size.y &&
      newPosition.y + this.size.y > newOtherPosition.y
    ) {
      return "y collision"
    }

    return "no collision"
  }
}
