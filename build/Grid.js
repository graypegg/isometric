export class Grid {
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
//# sourceMappingURL=Grid.js.map