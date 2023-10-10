import "./style.css"
import { Game } from "./Game"

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const c = canvas.getContext("2d") as CanvasRenderingContext2D
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const game = new Game(canvas.width, canvas.height)
// const fps: number = 60
let lastTime: number = 0
let timeTemp: number = 0

const animate = (timeStamp: number) => {
  const deltaTime = timeStamp - lastTime
  lastTime = timeStamp
  timeTemp += deltaTime
  requestAnimationFrame(animate)
  // if (timeTemp < 1000 / 40) return
  // else {
  //   timeTemp = 0
  //   // timeTemp += deltaTime
  // }

  game.deltaTime = deltaTime
  game.update()
  game.draw(c)
}

animate(0)
