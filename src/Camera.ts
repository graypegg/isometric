import {Canvas} from "./Canvas.js"

export type Vector2D = [number, number]

export class Camera {
    public zoom: number = 1;
    public orbit: number = 0;

    constructor(public canvas: Canvas) {
    }

    /* map a real canvas point to a projected plane */
    project(x: number, y: number, elevation: number = 0): Vector2D {
        let rotatedX = (x * this.rotateTransform[0][0] - elevation) + (y * this.rotateTransform[1][0] - elevation)
        let rotatedY = (x * this.rotateTransform[0][1] - elevation) + (y * this.rotateTransform[1][1] - elevation)

        let zoomedX = (rotatedX * this.zoomTransform[0][0]) + (rotatedY * this.zoomTransform[1][0]) + this.xOffset
        let zoomedY = (rotatedX * this.zoomTransform[0][1]) + (rotatedY * this.zoomTransform[1][1]) + this.yOffset

        return [zoomedX, zoomedY]
    }

    inverseProject(x: number, y: number, elevation: number = 0): Vector2D {
        let unzoomedX = ((x - this.xOffset) * this.zoomTransformInv[0][0]) + ((y - this.yOffset) * this.zoomTransformInv[1][0])
        let unzoomedY = ((x - this.xOffset) * this.zoomTransformInv[0][1]) + ((y - this.yOffset) * this.zoomTransformInv[1][1])

        let unrotatedX = ((unzoomedX + elevation) * this.rotateTransformInv[0][0]) + ((unzoomedY + elevation) * this.rotateTransformInv[1][0])
        let unrotatedY = ((unzoomedX + elevation) * this.rotateTransformInv[0][1]) + ((unzoomedY + elevation) * this.rotateTransformInv[1][1])

        return [unrotatedX, unrotatedY]
    }

    get a() {
        return 0.5 * this.canvas.settings.unitWidth * this.zoom
    }

    get b() {
        return 0.25 * this.canvas.settings.unitHeight * this.zoom
    }

    get c() {
        return -0.5 * this.canvas.settings.unitWidth * this.zoom
    }

    get d() {
        return 0.25 * this.canvas.settings.unitHeight * this.zoom
    }

    get ra() {
        return Math.cos(this.orbit)
    }

    get rb() {
        return Math.sin(this.orbit)
    }

    get rc() {
        return -Math.sin(this.orbit)
    }

    get rd() {
        return Math.cos(this.orbit)
    }

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

    private get xOffset() {
        return (this.canvas.areaWidth - (this.canvas.settings.unitWidth / 2)) / 2
    }

    private get yOffset() {
        return (this.canvas.areaHeight - (this.canvas.settings.unitHeight / 2)) / 2
    }
}
