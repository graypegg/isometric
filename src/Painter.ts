import {Canvas} from "./Canvas.js"
import {Tile} from "./Tile.js"

export class Painter {
    constructor(
        private canvas: Canvas,
        public tiles: Tile[]
    ) { }

    start() {
        let i = 0
        setInterval(() => {
            i++
            requestAnimationFrame(this.draw.bind(this))
            //camera.orbit = (Math.sin(i / 50) + 1.5)
            //camera.zoom = (Math.sin(i / 50) + 1.5)
            //camera.zoom = 1.5
            //camera.orbit = Math.PI / 1.5
        }, 16)
    }

    draw() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.areaWidth, this.canvas.areaHeight)
        this.tiles.sort((tileA, tileB) => {
            return tileA.elevation - tileB.elevation
        }).forEach(tile => {
            tile.draw()
        })
    }
}
