import {Tile} from "./Tile.js"

export class Picture extends Tile {
    private image = new Image()
    private slices: { r: number, g: number, b: number }[][] = [];
    private initalized = false;
    public readonly density = 1
    private i = Math.random() * 200

    private readonly textureResolution = 32;

    constructor(image: string, ...props: any[]) {
        // @ts-ignore
        super(...props);
        this.image.onload = this.initialize.bind(this)
        this.image.src = image
    }

    initialize() {
        const sampleSize = this.image.height * this.density * this.height

        const sliceSize = sampleSize / this.textureResolution

        for (let x = 0; x <= sampleSize; x += sliceSize) {
            this.slices.push([])
            for (let y = 0; y <= sampleSize; y += sliceSize) {
                this.slices[this.slices.length - 1].push(this.getAverageColour(x, y, sliceSize))
            }
        }
        this.initalized = true
    }

    getAverageColour(x: number, y: number, blur: number) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = this.image.width
        canvas.height = this.image.height
        context.drawImage(this.image, 0, 0);

        const resolution = Math.ceil(blur)

        const rows = new Array(resolution).fill(null).map((_) => new Array(resolution).fill(null)) as never[][]
        return rows.reduce((avg, rowArray, row) => {
            const avgColourForRow = rowArray.reduce((rowAvg, _, col) => {
                const pixel = context.getImageData(row + y, col + x, 1, 1);
                const [r, g, b] = pixel.data
                return {
                    r: rowAvg.r + (r / rowArray.length),
                    g: rowAvg.g + (g / rowArray.length),
                    b: rowAvg.b + (b / rowArray.length)
                }
            }, {r: 0, g: 0, b: 0})

            return {
                r: avg.r + (avgColourForRow.r / rows.length),
                g: avg.g + (avgColourForRow.g / rows.length),
                b: avg.b + (avgColourForRow.b / rows.length)
            }

        }, {r: 0, g: 0, b: 0})
    }

    draw() {
        this.i++
        if (!this.initalized) return
        const sliceSize = this.height / this.textureResolution

        this.slices.forEach((row, y) => {
            row.forEach((col, x) => {
                const xOffset = x * sliceSize
                const yOffset = y * sliceSize
                this.canvas.ctx.fillStyle = `rgb(${col.r}, ${col.g}, ${col.b})`;
                this.canvas.ctx.beginPath()
                const animationSpeed = 40;
                this.elevation =  Math.sin((this.i + (xOffset * 40) + (yOffset * 40)) / animationSpeed)
                this.canvas.ctx.moveTo(...this.camera.project(this.x + xOffset, this.y + yOffset, this.elevation))


                this.elevation =  Math.sin((this.i + ((xOffset + sliceSize) * 40) + (yOffset * 40)) / animationSpeed)
                this.canvas.ctx.lineTo(...this.camera.project(this.x + xOffset + sliceSize, this.y + yOffset, this.elevation))



                this.elevation =  Math.sin((this.i + ((xOffset + sliceSize) * 40) + ((yOffset + sliceSize) * 40)) / animationSpeed)
                this.canvas.ctx.lineTo(...this.camera.project(this.x + xOffset + sliceSize, this.y + yOffset + sliceSize, this.elevation))


                this.elevation =  Math.sin((this.i + (xOffset * 40) + ((yOffset + sliceSize) * 40)) / animationSpeed)
                this.canvas.ctx.lineTo(...this.camera.project(this.x + xOffset, this.y + yOffset + sliceSize, this.elevation))


                this.elevation =  Math.sin((this.i + (xOffset * 40) + (yOffset * 40)) / animationSpeed)
                this.canvas.ctx.lineTo(...this.camera.project(this.x + xOffset, this.y + yOffset, this.elevation))
                this.canvas.ctx.fill()
            })
        })
    }
}
