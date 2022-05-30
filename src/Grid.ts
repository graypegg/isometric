import {Canvas} from "./Canvas.js"

export class Grid {
    constructor(
        private canvas: Canvas,
        public tileWidth: number,
        public tileHeight: number
    ) {
    }

    get areaWidth() {
        return this.canvas.el.width
    }

    get areaHeight() {
        return this.canvas.el.height
    }
}
