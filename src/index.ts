import {Canvas} from "./Canvas.js"
import {Camera} from "./Camera.js"
import {Tile} from "./Tile.js"
import {Painter} from "./Painter.js"
import {Picture} from "./Picture.js";

const canvas = new Canvas(document.querySelector('canvas'), {
    unitWidth: 85,
    unitHeight: 85
})
const camera = new Camera(canvas)

class Cube extends Tile {
    draw () {
        const elLow = this.elevation + (this.height / 2)
        const elHigh = this.elevation
        this.canvas.ctx.fillStyle = '#8899a1';
        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(this.x, this.y, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y + this.height, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y + this.height, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y, elLow))
        // this.canvas.ctx.fill()
        this.canvas.ctx.stroke()

        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(this.x, this.y, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y, elLow))
        // this.canvas.ctx.fill()
        this.canvas.ctx.stroke()

        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(this.x + this.width, this.y, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y + this.height, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y + this.height, elLow))
        // this.canvas.ctx.fill()
        this.canvas.ctx.stroke()

        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(this.x + this.width, this.y + this.height, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y + this.height, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y + this.height, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y + this.height, elLow))
        // this.canvas.ctx.fill()
        this.canvas.ctx.stroke()

        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(this.x, this.y + this.height, elLow))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y + this.height, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y, elHigh))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y, elLow))
        // this.canvas.ctx.fill()
        this.canvas.ctx.stroke()
    }
}

const tiles = [
    new Tile(canvas, camera, 1,-1, 0.5),
    new Tile(canvas, camera, -1,1, 1),
    new Tile(canvas, camera, -1,1, 0),
    new Tile(canvas, camera, -1,1, -1),
    new Cube(canvas, camera, -1.5,-1.5, -1, 4, 4),
]
new Painter(canvas, tiles).start()

let i = 0
camera.zoom = 0.8
camera.orbit = Math.PI
setInterval(() => camera.orbit += 0.01, 16)
//setInterval(() => camera.zoom += (Math.sin(i++ / 50) / 100), 16)

