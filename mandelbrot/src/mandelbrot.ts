class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

class MandelbrotRenderer {
    centre: Complex = new Complex(0, 0);
    scale: number = 0.5;
    iterationDepth: number = 1000;

    ctx: CanvasRenderingContext2D;
    canvasData: ImageData;

    width: number;
    height: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvasData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);

        this.width = this.canvasData.width;
        this.height = this.canvasData.height;
    }

    screenXToComplexRe(x: number) {
        return this.centre.re + (x - this.width/2) / (this.scale * this.width/2);
    }

    screenYToComplexIm(y: number) {
        return this.centre.im + (y - this.height/2) / (this.scale * this.height/2);
    }

    draw() {
        console.time("mandie_timer");
    
        let i = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++, i += 4) {

                let re = this.screenXToComplexRe(x);
                let im = this.screenYToComplexIm(y);
    
                if (this.mandelbrotSetContains(re, im)) {
                    this.canvasData.data[i+0] = 0x00;
                    this.canvasData.data[i+1] = 0x00;
                    this.canvasData.data[i+2] = 0x00;
                    this.canvasData.data[i+3] = 0xFF;
                } else {
                    this.canvasData.data[i+0] = 0xFF;
                    this.canvasData.data[i+1] = 0xFF;
                    this.canvasData.data[i+2] = 0xFF;
                    this.canvasData.data[i+3] = 0xFF;
                }
    
            }
        }

        this.ctx.putImageData(this.canvasData, 0, 0);
    
        console.timeEnd("mandie_timer");
    }

    zoomInTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale *= 1.25;
        this.draw();
    }

    zoomOutTo(x: number, y: number) {
        this.centre = this.screenToComplex(x, y);
        this.scale /= 1.25;
        this.draw();
    }

    private screenToComplex(x: number, y: number) {
        let re = this.screenXToComplexRe(x);
        let im = this.screenYToComplexIm(y);

        const z = new Complex(re, im);
        return z;
    }

    private mandelbrotSetContains(kre: number, kim: number): boolean {
        let zre = 0;
        let zim = 0;

        for (let i = 0; i < this.iterationDepth; i++) {
            let z2re = zre*zre - zim*zim + kre;
            let z2im = 2*zre*zim + kim;

            zre = z2re;
            zim = z2im;

            if (magnitudeSquared(zre, zim) >= 4) {
                return false;
            }
        }

        return true;
    }
}

function magnitudeSquared(re: number, im: number): number {
    return re*re + im*im;
}

let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
canvas.onmousedown = (e) => {
    if (e.button == 0) {
        mandie.zoomInTo(e.x, e.y);
    } else if (e.button == 2) {
        mandie.zoomOutTo(e.x, e.y);
    }
};
canvas.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation() };
let ctx = canvas.getContext("2d")!;
let mandie = new MandelbrotRenderer(ctx);

mandie.draw();

