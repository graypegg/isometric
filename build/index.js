import { Canvas } from "./Canvas.js";
class Grid {
    constructor(canvas, tileWidth, tileHeight) {
        this.canvas = canvas;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }
    get areaWidth() {
        return this.canvas.el.width;
    }
    get areaHeight() {
        return this.canvas.el.height;
    }
}
class Camera {
    constructor(grid) {
        this.grid = grid;
        this.zoom = 1;
        this.orbit = 0;
    }
    project(x, y) {
        let rotatedX = (x * this.rotateTransform[0][0]) + (y * this.rotateTransform[1][0]);
        let rotatedY = (x * this.rotateTransform[0][1]) + (y * this.rotateTransform[1][1]);
        let zoomedX = (rotatedX * this.zoomTransform[0][0]) + (rotatedY * this.zoomTransform[1][0]) + this.xOffset;
        let zoomedY = (rotatedX * this.zoomTransform[0][1]) + (rotatedY * this.zoomTransform[1][1]) + this.yOffset;
        return [zoomedX, zoomedY];
    }
    inverseProject(x, y) {
        let unzoomedX = ((x - this.xOffset) * this.zoomTransformInv[0][0]) + ((y - this.yOffset) * this.zoomTransformInv[1][0]);
        let unzoomedY = ((x - this.xOffset) * this.zoomTransformInv[0][1]) + ((y - this.yOffset) * this.zoomTransformInv[1][1]);
        let unrotatedX = (unzoomedX * this.rotateTransformInv[0][0]) + (unzoomedY * this.rotateTransformInv[1][0]);
        let unrotatedY = (unzoomedX * this.rotateTransformInv[0][1]) + (unzoomedY * this.rotateTransformInv[1][1]);
        return [unrotatedX, unrotatedY];
    }
    get a() { return 0.5 * this.grid.tileWidth * this.zoom; }
    get b() { return 0.25 * this.grid.tileHeight * this.zoom; }
    get c() { return -0.5 * this.grid.tileWidth * this.zoom; }
    get d() { return 0.25 * this.grid.tileHeight * this.zoom; }
    get ra() { return Math.cos(this.orbit); }
    get rb() { return Math.sin(this.orbit); }
    get rc() { return -Math.sin(this.orbit); }
    get rd() { return Math.cos(this.orbit); }
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
    get xOffset() { return (this.grid.areaWidth - (this.grid.tileWidth / 2)) / 2; }
    get yOffset() { return (this.grid.areaHeight - (this.grid.tileHeight / 2)) / 2; }
}
class Tile {
    constructor(canvas, camera, x, y, height = 1, width = 1) {
        this.canvas = canvas;
        this.camera = camera;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.xOffset = 0;
        this.yOffset = 0;
        this.fillStyle = `rgba(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`;
        this.isLifted = false;
        this.canvas.el.addEventListener('mousemove', (event) => {
            const { clientX, clientY, target } = event;
            const canvasArea = target.getBoundingClientRect();
            const x = clientX - canvasArea.left;
            const y = clientY - canvasArea.top;
            const tile = this.camera.inverseProject(x, y).map(d => Math.floor(d));
            if (this.isPointInside(tile[0], tile[1])) {
                this.lift();
            }
            else {
                this.drop();
            }
        });
    }
    draw() {
        const visualX = this.x + this.xOffset;
        const visualY = this.y + this.yOffset;
        this.canvas.ctx.fillStyle = this.fillStyle;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(...this.camera.project(visualX, visualY));
        this.canvas.ctx.lineTo(...this.camera.project(visualX + this.width, visualY));
        this.canvas.ctx.lineTo(...this.camera.project(visualX + this.width, visualY + this.height));
        this.canvas.ctx.lineTo(...this.camera.project(visualX, visualY + this.height));
        this.canvas.ctx.lineTo(...this.camera.project(visualX, visualY));
        this.canvas.ctx.fill();
        this.canvas.ctx.stroke();
    }
    isPointInside(x, y) {
        return ((x >= this.x && x < (this.x + this.width)) &&
            (y >= this.y && y < (this.y + this.height)));
    }
    lift() {
        if (this.isLifted)
            return;
        this.xOffset -= 0.25;
        this.yOffset -= 0.25;
        this.isLifted = true;
    }
    drop() {
        if (!this.isLifted)
            return;
        this.xOffset += 0.25;
        this.yOffset += 0.25;
        this.isLifted = false;
    }
}
class Painter {
    constructor(tiles, canvas) {
        this.tiles = tiles;
        this.canvas = canvas;
    }
    start() {
        let i = 0;
        setInterval(() => {
            i++;
            requestAnimationFrame(this.draw.bind(this));
            camera.orbit = Math.sin(i / 50);
            camera.zoom = (Math.sin(i / 50) + 1.5);
        }, 16);
    }
    draw() {
        this.canvas.ctx.clearRect(0, 0, 700, 500);
        this.tiles.forEach(tile => {
            tile.draw();
        });
    }
}
const canvas = new Canvas(document.querySelector('canvas'));
const grid = new Grid(canvas, 100, 100);
const camera = new Camera(grid);
const source = Array(10).fill(Array(10).fill(''));
const tiles = source.flatMap((row, x) => {
    return row.map((_, y) => {
        return new Tile(canvas, camera, x - 5, y - 5);
    });
});
const painter = new Painter(tiles, canvas);
painter.start();
//# sourceMappingURL=index.js.map