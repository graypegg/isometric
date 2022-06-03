import { Canvas } from "./Canvas.js";
import { Camera } from "./Camera.js";
import { Painter } from "./Painter.js";
import { Picture } from "./Picture.js";
const canvas = new Canvas(document.querySelector('canvas'), {
    unitWidth: 85,
    unitHeight: 85
});
const camera = new Camera(canvas);
const tiles = [
    new Picture('./textures/dog.png', canvas, camera, -1, -1, 0),
    new Picture('./textures/cat.jpg', canvas, camera, 1, 1, 0),
];
new Painter(canvas, tiles).start();
let i = 0;
setInterval(() => camera.orbit += 0.01, 16);
setInterval(() => camera.zoom += (Math.sin(i++ / 50) / 100), 16);
//# sourceMappingURL=index.js.map