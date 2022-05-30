export class Camera {
    constructor(grid) {
        this.grid = grid;
        this.zoom = 1;
        this.orbit = 0;
    }
    project(x, y, elevation = 0) {
        let rotatedX = (x * this.rotateTransform[0][0] - elevation) + (y * this.rotateTransform[1][0] - elevation);
        let rotatedY = (x * this.rotateTransform[0][1] - elevation) + (y * this.rotateTransform[1][1] - elevation);
        let zoomedX = (rotatedX * this.zoomTransform[0][0]) + (rotatedY * this.zoomTransform[1][0]) + this.xOffset;
        let zoomedY = (rotatedX * this.zoomTransform[0][1]) + (rotatedY * this.zoomTransform[1][1]) + this.yOffset;
        return [zoomedX, zoomedY];
    }
    inverseProject(x, y, elevation = 0) {
        let unzoomedX = ((x - this.xOffset) * this.zoomTransformInv[0][0]) + ((y - this.yOffset) * this.zoomTransformInv[1][0]);
        let unzoomedY = ((x - this.xOffset) * this.zoomTransformInv[0][1]) + ((y - this.yOffset) * this.zoomTransformInv[1][1]);
        let unrotatedX = ((unzoomedX + elevation) * this.rotateTransformInv[0][0]) + ((unzoomedY + elevation) * this.rotateTransformInv[1][0]);
        let unrotatedY = ((unzoomedX + elevation) * this.rotateTransformInv[0][1]) + ((unzoomedY + elevation) * this.rotateTransformInv[1][1]);
        return [unrotatedX, unrotatedY];
    }
    get a() {
        return 0.5 * this.grid.tileWidth * this.zoom;
    }
    get b() {
        return 0.25 * this.grid.tileHeight * this.zoom;
    }
    get c() {
        return -0.5 * this.grid.tileWidth * this.zoom;
    }
    get d() {
        return 0.25 * this.grid.tileHeight * this.zoom;
    }
    get ra() {
        return Math.cos(this.orbit);
    }
    get rb() {
        return Math.sin(this.orbit);
    }
    get rc() {
        return -Math.sin(this.orbit);
    }
    get rd() {
        return Math.cos(this.orbit);
    }
    static getDeterminant(a, b, c, d) {
        return 1 / ((a * d) - (b * c));
    }
    get zoomTransform() {
        return [
            [this.a, this.b],
            [this.c, this.d]
        ];
    }
    get zoomTransformInv() {
        const determinant = Camera.getDeterminant(this.a, this.b, this.c, this.d);
        return [
            [determinant * this.d, determinant * -this.b],
            [determinant * -this.c, determinant * this.a]
        ];
    }
    get rotateTransform() {
        return [
            [this.ra, this.rb],
            [this.rc, this.rd]
        ];
    }
    get rotateTransformInv() {
        const determinant = Camera.getDeterminant(this.ra, this.rb, this.rc, this.rd);
        return [
            [determinant * this.rd, determinant * -this.rb],
            [determinant * -this.rc, determinant * this.ra]
        ];
    }
    get xOffset() {
        return (this.grid.areaWidth - (this.grid.tileWidth / 2)) / 2;
    }
    get yOffset() {
        return (this.grid.areaHeight - (this.grid.tileHeight / 2)) / 2;
    }
}
//# sourceMappingURL=Camera.js.map