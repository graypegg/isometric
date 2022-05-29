import {Canvas} from "./Canvas.js"

type Vector2D = [number, number]

class Grid {
    constructor(
        private canvas: Canvas,
        public tileWidth: number,
        public tileHeight: number
    ) { }

    get areaWidth() {
        return this.canvas.el.width
    }

    get areaHeight() {
        return this.canvas.el.height
    }
}

class Camera {
    public zoom: number = 1;
    public orbit: number = 0;
    constructor(public grid: Grid) { }

    project(x: number, y: number): Vector2D {
        let rotatedX = (x * this.rotateTransform[0][0]) + (y * this.rotateTransform[1][0])
        let rotatedY = (x * this.rotateTransform[0][1]) + (y * this.rotateTransform[1][1])

        let zoomedX = (rotatedX * this.zoomTransform[0][0]) + (rotatedY * this.zoomTransform[1][0]) + this.xOffset
        let zoomedY = (rotatedX * this.zoomTransform[0][1]) + (rotatedY * this.zoomTransform[1][1]) + this.yOffset

        return [zoomedX, zoomedY]
    }

    inverseProject(x: number, y: number): Vector2D {
        let unzoomedX = ((x - this.xOffset) * this.zoomTransformInv[0][0]) + ((y - this.yOffset) * this.zoomTransformInv[1][0])
        let unzoomedY = ((x - this.xOffset) * this.zoomTransformInv[0][1]) + ((y - this.yOffset) * this.zoomTransformInv[1][1])

        let unrotatedX = (unzoomedX * this.rotateTransformInv[0][0]) + (unzoomedY * this.rotateTransformInv[1][0])
        let unrotatedY = (unzoomedX * this.rotateTransformInv[0][1]) + (unzoomedY * this.rotateTransformInv[1][1])

        return [unrotatedX, unrotatedY]
    }

    private get a() { return 0.5 * this.grid.tileWidth * this.zoom }
    private get b() { return 0.25 * this.grid.tileHeight * this.zoom }
    private get c() { return -0.5 * this.grid.tileWidth * this.zoom }
    private get d() { return 0.25 * this.grid.tileHeight * this.zoom }

    private get ra () { return Math.cos(this.orbit) }
    private get rb () { return Math.sin(this.orbit) }
    private get rc () { return -Math.sin(this.orbit) }
    private get rd () { return Math.cos(this.orbit) }

    private static getDeterminant(a: number, b: number, c: number, d: number) {
        return 1 / ((a * d) - (b * c))
    }

    private get zoomTransform() {
        return [
            [this.a, this.b],
            [this.c, this.d]
        ]
    }

    private get zoomTransformInv() {
        const determinant = Camera.getDeterminant(this.a, this.b, this.c, this.d);
        return [
            [determinant * this.d, determinant * -this.b],
            [determinant * -this.c, determinant * this.a]
        ]
    }

    private get rotateTransform() {
        return [
            [this.ra, this.rb],
            [this.rc, this.rd]
        ]
    }

    private get rotateTransformInv() {
        const determinant = Camera.getDeterminant(this.ra, this.rb, this.rc, this.rd);
        return [
            [determinant * this.rd, determinant * -this.rb],
            [determinant * -this.rc, determinant * this.ra]
        ]
    }

    private get xOffset() { return (this.grid.areaWidth - (this.grid.tileWidth / 2)) / 2 }
    private get yOffset() { return (this.grid.areaHeight - (this.grid.tileHeight / 2)) / 2 }
}

class Tile {
    public xOffset: number = 0
    public yOffset: number = 0
    public fillStyle: string = `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`
    constructor(
        private canvas: Canvas,
        private camera: Camera,
        public x: number,
        public y: number,
        public height: number = 1,
        public width: number = 1
    ) {
        this.canvas.el.addEventListener('mousemove', (event: MouseEvent) => {
            const {clientX, clientY, target} = event
            const canvasArea = (target as HTMLCanvasElement).getBoundingClientRect()
            const x = clientX - canvasArea.left
            const y = clientY - canvasArea.top

            const tile = this.camera.inverseProject(x, y).map(d => Math.floor(d))

            if (this.isPointInside(tile[0], tile[1])) {
                this.lift()
            } else {
                this.drop()
            }
        })
    }

    draw() {
        const visualX = this.x + this.xOffset
        const visualY = this.y + this.yOffset
        this.canvas.ctx.fillStyle = this.fillStyle
        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(visualX, visualY))
        this.canvas.ctx.lineTo(...this.camera.project(visualX + this.width, visualY))
        this.canvas.ctx.lineTo(...this.camera.project(visualX + this.width, visualY + this.height))
        this.canvas.ctx.lineTo(...this.camera.project(visualX, visualY + this.height))
        this.canvas.ctx.lineTo(...this.camera.project(visualX, visualY))
        this.canvas.ctx.fill()
        this.canvas.ctx.stroke()
    }

    isPointInside (x: number, y: number) {
        return (
            (x >= this.x && x < (this.x + this.width)) &&
            (y >= this.y && y < (this.y + this.height))
        )
    }

    private isLifted = false

    lift() {
        if (this.isLifted) return
        this.xOffset -= 0.25
        this.yOffset -= 0.25
        this.isLifted = true
    }

    drop() {
        if (!this.isLifted) return
        this.xOffset += 0.25
        this.yOffset += 0.25
        this.isLifted = false
    }
}

class Painter {
    constructor(public tiles: Tile[], public canvas: Canvas) { }

    start() {
        let i = 0
        setInterval(() => {
            i++
            requestAnimationFrame(this.draw.bind(this))
            camera.orbit = Math.sin(i / 50)
            camera.zoom = (Math.sin(i / 50) + 1.5)
        }, 16)
    }

    draw() {
        this.canvas.ctx.clearRect(0, 0, 700, 500)
        this.tiles.forEach(tile => {
            tile.draw()
        })
    }
}

const canvas = new Canvas(document.querySelector('canvas'))
const grid = new Grid(canvas, 100, 100)
const camera = new Camera(grid)

const source: Array<Array<''>> = Array(10).fill(Array(10).fill(''))
const tiles = source.flatMap((row, x) => {
    return row.map((_, y) => {
        return new Tile(canvas, camera, x - 5, y - 5)
    })
})

const painter = new Painter(tiles, canvas)

painter.start()
