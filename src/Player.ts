import { Game } from "./Game"
import { Rigid, Vector, Position, Velocity, Size } from "./Rigid"

export class Player extends Rigid {
  readonly spriteSize: Vector = { x: 200, y: 181.83 }
  readonly fps: number = 10
  readonly speed: number = 2
  readonly jumpSpeed: number = 6
  islanded: boolean = false
  tempTime: number = 0
  image: HTMLImageElement
  state: State
  game: Game

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

    this.state.draw(c)
  }
  update(input: string[]): void {
    super.update()
    this.state.handleInput(input)
  }
}

abstract class State {
  readonly fps: number = 15
  readonly maxFrame: number = 0
  readonly frameY: number = 0
  tempTime: number = 0
  frameX: number = 0
  name: String
  player: Player

  constructor(name: String, player: Player) {
    this.name = name
    this.player = player
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

    if (this.tempTime < 1000 / this.fps) {
      this.tempTime += this.player.game.deltaTime
    } else {
      this.tempTime = 0
      if (++this.frameX > this.maxFrame) this.frameX = 0
    }
  }
  abstract handleInput(input: string[]): void
}

class Standing extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 0
  constructor(player: Player) {
    super("STANDING", player)

    this.player.velocity.x = 0
  }

  handleInput(input: string[]) {
    this.player.velocity.x = 0

    if (input.includes("ArrowRight")) {
      this.player.state = new Running(this.player)
    }
    if (input.includes("ArrowLeft")) {
      this.player.state = new StandingLeft(this.player)
    }
    if (input.includes("ArrowUp")) {
      this.player.velocity.y = -this.player.jumpSpeed
      this.player.state = new Jumping(this.player)
    }
  }
}

class StandingLeft extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 1
  constructor(player: Player) {
    super("STANDINGLEFT", player)

    this.player.velocity.x = 0
  }

  handleInput(input: string[]) {
    this.player.velocity.x = 0

    if (input.includes("ArrowLeft")) {
      this.player.state = new RunningLeft(this.player)
    }

    if (input.includes("ArrowRight")) {
      this.player.state = new Standing(this.player)
    }
    if (input.includes("ArrowUp")) {
      this.player.velocity.y = -this.player.jumpSpeed
      this.player.state = new JumpingLeft(this.player)
    }
  }
}

class Running extends State {
  readonly maxFrame: number = 8
  readonly frameY: number = 6
  constructor(player: Player) {
    super("RUNNING", player)
    // player.velocity.x = 1
  }

  handleInput(input: string[]) {
    if (!input.includes("ArrowRight")) {
      this.player.state = new Standing(this.player)
    }
    if (input.includes("ArrowUp")) {
      this.player.velocity.y = -this.player.jumpSpeed
      this.player.state = new Jumping(this.player)
    }

    this.player.velocity.x = this.player.speed
  }
}

class RunningLeft extends State {
  readonly maxFrame: number = 8
  readonly frameY: number = 7
  constructor(player: Player) {
    super("RUNNINGLEFT", player)
    // player.velocity.x = 1
  }

  handleInput(input: string[]) {
    if (!input.includes("ArrowLeft")) {
      this.player.state = new StandingLeft(this.player)
    }
    if (input.includes("ArrowUp")) {
      this.player.velocity.y = -this.player.jumpSpeed
      this.player.state = new JumpingLeft(this.player)
    }

    this.player.velocity.x = -this.player.speed
  }
}

class Jumping extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 2
  constructor(player: Player) {
    super("JUMPING", player)

    // this.player.velocity.y = -8
  }

  handleInput(input: string[]) {
    if (this.player.velocity.y >= 0) {
      this.player.state = new Falling(this.player)
    }
    if (input.includes("ArrowRight")) {
      this.player.velocity.x = this.player.speed
    }

    if (input.includes("ArrowLeft")) {
      this.player.state = new JumpingLeft(this.player)
    }
  }
}
class JumpingLeft extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 3
  constructor(player: Player) {
    super("JUMPINGLeft", player)

    // this.player.velocity.y = -8
  }

  handleInput(input: string[]) {
    if (this.player.velocity.y >= 0) {
      this.player.state = new FallingLeft(this.player)
    }
    if (input.includes("ArrowLeft")) {
      this.player.velocity.x = -this.player.speed
    }
    if (input.includes("ArrowRight")) {
      this.player.state = new Jumping(this.player)
    }
  }
}

class Falling extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 4
  constructor(player: Player) {
    super("Falling", player)
  }

  handleInput(input: string[]) {
    // if (this.player.velocity.y >= 0) {
    //   this.player.state = new Standing(this.player)
    // }
    if (input.includes("ArrowRight")) {
      this.player.velocity.x = this.player.speed
    }
    if (input.includes("ArrowLeft")) {
      this.player.state = new FallingLeft(this.player)
    }
    if (this.player.islanded) {
      this.player.state = new Standing(this.player)
    }
  }
}
class FallingLeft extends State {
  readonly maxFrame: number = 6
  readonly frameY: number = 5
  constructor(player: Player) {
    super("Falling", player)
  }

  handleInput(input: string[]) {
    if (input.includes("ArrowLeft")) {
      this.player.velocity.x = -this.player.speed
    }
    if (input.includes("ArrowRight")) {
      this.player.state = new Falling(this.player)
    }
    if (this.player.islanded) {
      this.player.state = new Standing(this.player)
    }
  }
}
