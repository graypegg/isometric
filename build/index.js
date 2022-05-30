import { Canvas } from "./Canvas.js";
import { Camera } from "./Camera.js";
import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";
import { Painter } from "./Painter.js";
const canvas = new Canvas(document.querySelector('canvas'));
const grid = new Grid(canvas, 45, 45);
const camera = new Camera(grid);
const source = Array(40).fill(Array(40).fill(''));
const tiles = source.flatMap((row, x) => {
    return row.map((_, y) => {
        return new Tile(canvas, camera, x - 20, y - 20, 0);
    });
});
const painter = new Painter(tiles, canvas);
painter.start();
//# sourceMappingURL=index.js.map