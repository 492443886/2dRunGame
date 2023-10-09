export class InputHandler {
  keys: string[]
  constructor() {
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
      // console.log(this.keys)
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
      // console.log(this.keys)
    })
  }
}
