export class Painter {
    constructor(tiles, canvas) {
        this.tiles = tiles;
        this.canvas = canvas;
    }
    start() {
        let i = 0;
        setInterval(() => {
            i++;
            requestAnimationFrame(this.draw.bind(this));
        }, 16);
    }
    draw() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.el.width, this.canvas.el.height);
        this.tiles.sort((tileA, tileB) => {
            return tileA.elevation - tileB.elevation;
        }).forEach(tile => {
            tile.draw();
        });
    }
}
//# sourceMappingURL=Painter.js.map