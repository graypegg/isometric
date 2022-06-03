export class Tile {
    constructor(canvas, camera, x, y, elevation = 0, height = 1, width = 1) {
        this.canvas = canvas;
        this.camera = camera;
        this.x = x;
        this.y = y;
        this.elevation = elevation;
        this.height = height;
        this.width = width;
        this.isLifted = false;
        this.oldElevation = null;
    }
    draw() {
        if (this.canvas.mouse.x && this.canvas.mouse.y) {
            const tile = this.camera.inverseProject(this.canvas.mouse.x, this.canvas.mouse.y, this.elevation).map(d => Math.floor(d));
            if (this.isPointInside(tile[0], tile[1])) {
                this.lift();
            }
            else {
                this.drop();
            }
        }
        else {
            this.drop();
        }
        this.canvas.ctx.fillStyle = this.isLifted ? '#a19988' : '#8899a1';
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(...this.camera.project(this.x, this.y, this.elevation));
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y, this.elevation));
        this.canvas.ctx.lineTo(...this.camera.project(this.x + this.width, this.y + this.height, this.elevation));
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y + this.height, this.elevation));
        this.canvas.ctx.lineTo(...this.camera.project(this.x, this.y, this.elevation));
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
        this.oldElevation = this.elevation;
        this.elevation += 0.1;
        this.isLifted = true;
    }
    drop() {
        if (!this.isLifted)
            return;
        if (this.oldElevation)
            this.elevation = this.oldElevation;
        else
            this.elevation = 0;
        this.isLifted = false;
    }
}
//# sourceMappingURL=Tile.js.map