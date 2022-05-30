const DEFAULT_ISO_SETTINGS = {
    unitWidth: 25,
    unitHeight: 25
};
export class Canvas {
    constructor(el, settings = {}) {
        this.el = el;
        this.mouse = {
            x: 0,
            y: 0
        };
        this.ctx = el.getContext('2d');
        this.settings = Object.assign({}, DEFAULT_ISO_SETTINGS, settings);
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