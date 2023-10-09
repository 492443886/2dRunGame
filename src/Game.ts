import { Rigid, Position, Velocity, Size, Vector } from "./Rigid"

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
    this.blocks.push(new movingBlock({ x: 800, y: 170 }, { x: 0, y: 0 }, { x: 200, y: 30 }))

    this.input = new InputHandler()
  }

  update() {
    this.player.update(this.input)

    this.blocks.forEach((block) => {
      if (this.player.isColliding(block) !== "no collision") {
        if (this.player.isColliding(block) === "x collision") {
          this.player.velocity.x = 0
          //   console.log("x collision")
        } else if (this.player.isColliding(block) === "y collision") {
          this.player.velocity.y = 0
          //   console.log("y collision")
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
    this.state = new Standing()
    this.image = document.getElementById("shadowDog") as HTMLImageElement
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "#f00"
    c.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    c.drawImage(
      this.image,
      0 * this.spriteSize.x,
      0 * this.spriteSize.y,
      this.spriteSize.x,
      this.spriteSize.y,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y
    )
  }
  update(input: InputHandler): void {
    super.update()
    this.velocity.x = 0
    if (input.keys.includes("ArrowLeft")) {
      this.velocity.x += -10
    }

    if (input.keys.includes("ArrowRight")) {
      this.velocity.x += 10
    }

    if (input.keys.includes("ArrowUp")) {
      this.velocity.y = -2
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
    this.position.x += this.velocity.x
  }
}

class InputHandler {
  keys: string[]
  constructor() {
    // console.log("input handler created")
    this.keys = []
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Control") &&
        !this.keys.includes(e.key)
      ) {
        this.keys.push(e.key)
      }
      console.log(this.keys)
    })
    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "Control"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1)
      }
      console.log(this.keys)
    })
  }
}

//////////////////////////////////////////////////////
// STATE CLASS ///////////////////////////////////////
//////////////////////////////////////////////////////

class State {
  constructor(name: String) {}
}

/////////////////////////////////////////////////////////
// STANDING STATE ///////////////////////////////////////
/////////////////////////////////////////////////////////

class Standing extends State {
  constructor() {
    super("STANDING")
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

// window.addEventListener("keydown", function (e) {
//   // displayState.innerText = "keydown " + e.key
//   switch (e.key) {
//     case "ArrowLeft":
//       input = "PRESS left"
//       break
//     case "ArrowRight":
//       input = "PRESS right"
//       break
//     case "ArrowUp":
//       input = "PRESS up"
//       break
//     case "ArrowDown":
//       input = "PRESS down"
//       break
//     case "Control":
//       input = "PRESS attack"
//       break
//     case "a":
//       input = "PRESS left"
//       break
//     case "d":
//       input = "PRESS right"
//       break
//     case "w":
//       input = "PRESS up"
//       break
//     case "s":
//       input = "PRESS down"
//       break
//     case " ":
//       input = "PRESS attack"
//       break
//   }
// })
// window.addEventListener("keyup", function (e) {
//   // displayState.innerText = "keyup " + e.key
//   switch (e.key) {
//     case "ArrowLeft":
//       input = "RELEASE left"
//       break
//     case "ArrowRight":
//       input = "RELEASE right"
//       break
//     case "ArrowUp":
//       input = "RELEASE up"
//       break
//     case "ArrowDown":
//       input = "RELEASE down"
//       break
//     case "Control":
//       input = "RELEASE attack"
//       break
//     case "a":
//       input = "RELEASE left"
//       break
//     case "d":
//       input = "RELEASE right"
//       break
//     case "w":
//       input = "RELEASE up"
//       break
//     case "s":
//       input = "RELEASE down"
//       break
//     case " ":
//       input = "RELEASE attack"
//       break
//   }
