import {Canvas} from "./Canvas.js"
import {Camera} from "./Camera.js"

export class Tile {
    constructor(
        public readonly canvas: Canvas,
        public readonly camera: Camera,
        public x: number,
        public y: number,
        public elevation: number = 0,
        public height: number = 1,
        public width: number = 1
    ) {
    }

    draw() {
        if (this.canvas.mouse.x && this.canvas.mouse.y) {
            const tile = this.camera.inverseProject(this.canvas.mouse.x, this.canvas.mouse.y, this.elevation).map(d => Math.floor(d))

            if (this.isPointInside(tile[0], tile[1])) {
                this.lift()
            } else {
                this.drop()
            }
        } else {
            this.drop()
        }

        this.canvas.ctx.fillStyle = this.isLifted ? '#a19988' : '#8899a1';
        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(this.x, this.y, this.elevation))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y, this.elevation))
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y + this.height, this.elevation))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y + this.height, this.elevation))
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y, this.elevation))
        this.canvas.ctx.fill()
        this.canvas.ctx.stroke()
    }

    isPointInside(x: number, y: number) {
        return (
            (x >= this.x && x < (this.x + this.width)) &&
            (y >= this.y && y < (this.y + this.height))
        )
    }

    private isLifted = false
    private oldElevation: number | null = null

    lift() {
        if (this.isLifted) return
        this.oldElevation = this.elevation
        this.elevation += 0.1
        this.isLifted = true
    }

    drop() {
        if (!this.isLifted) return
        if (this.oldElevation) this.elevation = this.oldElevation
        else this.elevation = 0
        this.isLifted = false
    }
}
