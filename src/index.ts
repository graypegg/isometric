import {Canvas} from "./Canvas.js"

type Vector2D = [number, number]

class Grid {
    constructor(public tileWidth: number, public tileHeight: number, public areaWidth: number, public areaHeight: number) { }
}

class Camera {
    constructor(public grid: Grid) { }

    get a() { return 0.5 * this.grid.tileWidth }
    get b() { return 0.25 * this.grid.tileHeight }
    get c() { return -0.5 * this.grid.tileWidth }
    get d() { return 0.25 * this.grid.tileHeight }

    get determinant() {
        return 1 / ((this.a * this.d) - (this.b * this.c))
    }

    get transform() {
        return [
            [this.a, this.b],
            [this.c, this.d]
        ]
    }

    get transformInv() {
        return [
            [this.determinant * this.d, this.determinant * -this.b],
            [this.determinant * -this.c, this.determinant * this.a]
        ]
    }

    get xOffset() { return (this.grid.areaWidth - (this.grid.tileWidth / 2)) / 2 }

    project(x: number, y: number): Vector2D {
        let newX = (x * this.transform[0][0]) + (y * this.transform[1][0]) + this.xOffset
        let newY = (x * this.transform[0][1]) + (y * this.transform[1][1])

        return [newX, newY]
    }

    inverseProject(x: number, y: number): Vector2D {
        let newX = ((x - this.xOffset) * this.transformInv[0][0]) + (y * this.transformInv[1][0])
        let newY = ((x - this.xOffset) * this.transformInv[0][1]) + (y * this.transformInv[1][1])

        return [newX, newY]
    }
}

class Tile {
    public camera: Camera
    public xOffset: number = 0
    public yOffset: number = 0
    constructor(
        private canvas: Canvas,
        public x: number,
        public y: number,
        public height: number = 1,
        public width: number = 1
    ) {
        this.camera = new Camera(new Grid(100, 100, canvas.el.width, canvas.el.height))

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
        this.canvas.ctx.beginPath()
        this.canvas.ctx.moveTo(...this.camera.project(visualX, visualY))
        this.canvas.ctx.lineTo(...this.camera.project(visualX + this.width, visualY))
        this.canvas.ctx.lineTo(...this.camera.project(visualX + this.width, visualY + this.height))
        this.canvas.ctx.lineTo(...this.camera.project(visualX, visualY + this.height))
        this.canvas.ctx.lineTo(...this.camera.project(visualX, visualY))
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
        setInterval(() => requestAnimationFrame(this.draw.bind(this)), 16)
    }

    draw() {
        this.canvas.ctx.clearRect(0, 0, 700, 500)
        this.tiles.forEach(tile => {
            tile.draw()
        })
    }
}

const canvas = new Canvas(document.querySelector('canvas'))
/*const tiles = [
    new Tile(canvas, 0, 0),
    new Tile(canvas, 1, -1),
    new Tile(canvas, 2, -1),
    new Tile(canvas, 3, 3),
]*/
const source: Array<Array<''>> = Array(10).fill(Array(10).fill(''))
const tiles = source.flatMap((row, x) => row.map((_, y) => new Tile(canvas, x, y)))

tiles[32].height = 2
delete tiles[33]
const painter = new Painter(tiles, canvas)

painter.start()
