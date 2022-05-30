export class Canvas {
    constructor(el) {
        this.el = el;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.ctx = el.getContext('2d');
        el.addEventListener('mousemove', (event) => {
            const { clientX, clientY } = event;
            const canvasArea = el.getBoundingClientRect();
            this.mouse.x = clientX - canvasArea.left;
            this.mouse.y = clientY - canvasArea.top;
        });
        el.addEventListener('mouseout', () => {
            this.mouse = {
                x: null,
                y: null
            };
        });
    }
}
//# sourceMappingURL=Canvas.js.map