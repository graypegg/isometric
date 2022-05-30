import { Canvas } from "./Canvas.js";
import { Camera } from "./Camera.js";
import { Tile } from "./Tile.js";
import { Painter } from "./Painter.js";
let i = 0;
class Picture extends Tile {
    constructor(...props) {
        super(...props);
        this.image = new Image();
        this.image.src = 'https://styles.redditmedia.com/t5_50vhnl/styles/communityIcon_zt0hywfdgir71.png';
    }
    draw() {
        this.elevation = Math.sin(i++ / 100) * 0.7;
        const topleft = this.camera.project(this.x, this.y, this.elevation);
        const topright = this.camera.project(this.x + this.width, this.y, this.elevation);
        const bottomright = this.camera.project(this.x + this.width, this.y + this.height, this.elevation);
        const bottomleft = this.camera.project(this.x, this.y + this.height, this.elevation);
        const width = topright[0] - topleft[0];
        const height = bottomleft[1] - topleft[1];
        for (let y = 0; y < 256; y++) {
            for (let x = 0; x < 256; x++) {
                let widthPortion = (x / 256) * this.width;
                let heightPortion = (y / 256) * this.height;
                let coords = this.camera.project(this.x + widthPortion, this.y + heightPortion, this.elevation);
                this.canvas.ctx.drawImage(this.image, x, y, 1, 1, coords[0], coords[1], 1, 1);
            }
        }
    }
}
const canvas = new Canvas(document.querySelector('canvas'), {
    unitWidth: 85,
    unitHeight: 85
});
const camera = new Camera(canvas);
camera.zoom = 2;
const tiles = [
    new Tile(canvas, camera, 0, 0, 0),
    new Tile(canvas, camera, 1, 0, 0.1),
    new Picture(canvas, camera, 1, 1, 0.2),
    new Tile(canvas, camera, 2, 1, 0.3),
    new Tile(canvas, camera, 0, 1, 0.4)
];
new Painter(canvas, tiles).start();
setInterval(() => camera.orbit += 0.01, 16);
//# sourceMappingURL=index.js.map