import { Canvas } from "./Canvas.js";
import { Camera } from "./Camera.js";
import { Tile } from "./Tile.js";
import { Painter } from "./Painter.js";
const canvas = new Canvas(document.querySelector('canvas'), {
    tileWidth: 45,
    tileHeight: 45
});
const camera = new Camera(canvas);
const source = Array(40).fill(Array(40).fill(''));
const tiles = source.flatMap((row, x) => {
    return row.map((_, y) => {
        return new Tile(canvas, camera, x - 20, y - 20, 0);
    });
});
const painter = new Painter(canvas, tiles);
painter.start();
//# sourceMappingURL=index.js.map