import "./style.css"
import { Game } from "./Game"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const c = canvas.getContext("2d") as CanvasRenderingContext2D
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const game = new Game(canvas.width, canvas.height)

const animation = () => {
  requestAnimationFrame(animation)
  game.update()
  game.draw(c)
}

animation()
