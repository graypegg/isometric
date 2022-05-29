export class Canvas {
    public ctx: CanvasRenderingContext2D;

    constructor(public el: HTMLCanvasElement) {
        this.ctx = el.getContext('2d');
    }
}
