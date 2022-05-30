export class Canvas {
    public ctx: CanvasRenderingContext2D;
    public mouse: { x: number | null, y: number | null } = {
        x: 0,
        y: 0
    }

    constructor(public el: HTMLCanvasElement) {
        this.ctx = el.getContext('2d');

        el.addEventListener('mousemove', (event) => {
            const {clientX, clientY} = event
            const canvasArea = el.getBoundingClientRect()
            this.mouse.x = clientX - canvasArea.left
            this.mouse.y = clientY - canvasArea.top
        })

        el.addEventListener('mouseout', () => {
            this.mouse = {
                x: null,
                y: null
            }
        })
    }
}
