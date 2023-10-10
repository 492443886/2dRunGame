import { Rigid, Position, Velocity, Size } from "./Rigid"
import { InputHandler } from "./InputHandler"
import { Player } from "./Player.ts"
export class Game {
  width: number
  height: number
  player: Player
  blocks: Block[]
  input: InputHandler
  deltaTime: number
  constructor(width: number, height: number) {
    this.deltaTime = 0
    this.width = width
    this.height = height
    this.player = new Player(this, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 50, y: 45.6 })
    this.blocks = []
    // this.blocks.push(new Block({ x: 100, y: 0 }, { x: 0, y: 0 }, { x: 30, y: 200 }))
    this.blocks.push(new Block({ x: 0, y: 200 }, { x: 0, y: 0 }, { x: 1000, y: 30 }))
    this.blocks.push(new movingBlock({ x: 800, y: 170 }, { x: -0.1, y: -0.1 }, { x: 200, y: 100 }))

    this.input = new InputHandler()
  }

  update() {
    this.player.update(this.input.keys)
    this.player.islanded = false

    this.blocks.forEach((block) => {
      block.update()
      if (this.player.isColliding(block) !== "no collision") {
        if (this.player.isColliding(block) === "x collision") {
          this.player.velocity.x = block.velocity.x

          if (this.player.position.x < block.position.x) {
            this.player.position.x = block.position.x - this.player.size.x
          } else this.player.position.x = block.position.x + block.size.x + 1
          // console.log("x collision")
        }
        if (this.player.isColliding(block) === "y collision") {
          this.player.velocity.y = block.velocity.y

          if (this.player.position.y < block.position.y) {
            this.player.islanded = true
            this.player.position.y = block.position.y - this.player.size.y
          } else this.player.position.y = block.position.y + block.size.y + 1
          // console.log("y collision")
        }
      }
    })
  }
  draw(c: CanvasRenderingContext2D) {
    c.clearRect(0, 0, this.width, this.height)
    this.player.draw(c)
    this.blocks.forEach((block) => {
      block.draw(c)
    })
  }
}

export class Block extends Rigid {
  constructor(pos: Position, vel: Velocity, size: Size) {
    super(pos, vel, size)
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "blue"
    c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
  }
}
export class movingBlock extends Block {
  constructor(pos: Position, vel: Velocity, size: Size) {
    super(pos, vel, size)
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "yellow"
    c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
  }

  update(): void {
    super.update()
    // if (Math.random() > 0.5) this.position.x += 2 * this.velocity.x
    // else this.position.y += 2 * this.velocity.y
  }
}
