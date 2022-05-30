export class Painter {
    constructor(canvas, tiles) {
        this.canvas = canvas;
        this.tiles = tiles;
    }
    start() {
        let i = 0;
        setInterval(() => {
            i++;
            requestAnimationFrame(this.draw.bind(this));
        }, 16);
    }
    draw() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.areaWidth, this.canvas.areaHeight);
        this.tiles.sort((tileA, tileB) => {
            return tileA.elevation - tileB.elevation;
        }).forEach(tile => {
            tile.draw();
        });
    }
}
//# sourceMappingURL=Painter.js.map