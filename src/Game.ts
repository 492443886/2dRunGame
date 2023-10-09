import { Rigid, Position, Velocity, Size, Vector } from "./Rigid"
import { InputHandler } from "./InputHandler"
export class Game {
  width: number
  height: number
  player: Player
  blocks: Block[]
  input: InputHandler
  constructor(width: number, height: number) {
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
    this.player.update(this.input)

    this.blocks.forEach((block) => {
      block.update()
      if (this.player.isColliding(block) !== "no collision") {
        if (this.player.isColliding(block) === "x collision") {
          this.player.velocity.x = block.velocity.x

          if (this.player.position.x < block.position.x) {
            this.player.position.x = block.position.x - this.player.size.x
          } else this.player.position.x = block.position.x + block.size.x
          console.log("x collision")
        }
        if (this.player.isColliding(block) === "y collision") {
          this.player.velocity.y = block.velocity.y

          if (this.player.position.y < block.position.y) {
            this.player.position.y = block.position.y - this.player.size.y
          } else this.player.position.y = block.position.y + block.size.y
          console.log("y collision")
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

export class Player extends Rigid {
  game: Game
  state: State
  image: HTMLImageElement
  readonly spriteSize: Vector = { x: 200, y: 181.83 }
  constructor(gm: Game, pos: Position, vel: Velocity, size: Size) {
    super(pos, vel, size)
    this.weight = 0.2
    this.game = gm
    this.state = new Standing(this)
    this.image = document.getElementById("shadowDog") as HTMLImageElement
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#f00"
    c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    // c.drawImage(
    //   this.image,
    //   0 * this.spriteSize.x,
    //   0 * this.spriteSize.y,
    //   this.spriteSize.x,
    //   this.spriteSize.y,
    //   this.position.x,
    //   this.position.y,
    //   this.size.x,
    //   this.size.y
    // )

    this.state.draw(c)
  }
  update(input: InputHandler): void {
    super.update()
    this.velocity.x = 0
    // this.velocity.y = 0
    if (input.keys.includes("ArrowLeft")) {
      this.velocity.x += -10
    }

    if (input.keys.includes("ArrowRight")) {
      this.velocity.x += 10
    }

    if (input.keys.includes("ArrowUp")) {
      this.velocity.y = -2
    }

    if (input.keys.includes("ArrowDown")) {
      this.velocity.y = 2
    }
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

//////////////////////////////////////////////////////
// STATE CLASS ///////////////////////////////////////
//////////////////////////////////////////////////////

class State {
  name: String
  player: Player
  constructor(name: String, player: Player) {
    this.name = name
    this.player = player
  }

  draw(c: CanvasRenderingContext2D) {}
}

/////////////////////////////////////////////////////////
// STANDING STATE ///////////////////////////////////////
/////////////////////////////////////////////////////////

class Standing extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 0
  frameX: number
  constructor(player: Player) {
    super("STANDING", player)
    this.frameX = 0
  }

  draw(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.player.image,
      this.frameX * this.player.spriteSize.x,
      this.frameY * this.player.spriteSize.y,
      this.player.spriteSize.x,
      this.player.spriteSize.y,
      this.player.position.x,
      this.player.position.y,
      this.player.size.x,
      this.player.size.y
    )

    if (++this.frameX > this.maxFrame) this.frameX = 0
  }

  //   enter() {
  //     player.vx = 0
  //     player.frameX = 0
  //     player.frameY = 0
  //     player.maxFrame = 6
  //   }
  //   handleInput(input) {
  //     if (input === "PRESS right") {
  //       player.vx = player.speed
  //       player.setState(1) // running
  //     } else if (input === "PRESS left") {
  //       player.vx = -player.speed
  //       player.setState(1) // running
  //     } else if (input === "PRESS up") {
  //       if (player.onGround()) {
  //         player.setState(2) // jumping
  //       }
  //     } else if (input === "PRESS down") {
  //       player.setState(3) // sitting
  //     } else if (input === "PRESS attack") {
  //       player.setState(4) // rolling
  //     }
  //   }
}
