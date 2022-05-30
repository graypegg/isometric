const DEFAULT_ISO_SETTINGS = {
    tileWidth: 25,
    tileHeight: 25
};
export class Canvas {
    constructor(el, settings = {}) {
        this.el = el;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.ctx = el.getContext('2d');
        this.settings = Object.assign({}, settings, DEFAULT_ISO_SETTINGS);
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
    get areaWidth() {
        return this.el.width;
    }
    get areaHeight() {
        return this.el.height;
    }
}
//# sourceMappingURL=Canvas.js.map