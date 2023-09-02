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

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.canvasData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    draw() {
        console.time("mandie_timer");

        let width = this.canvasData.width;
        let height = this.canvasData.height;
    
        let i = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++, i += 4) {

                let re = this.centre.re + (x - width/2) / (this.scale * width/2);
                let im = this.centre.im + (y - height/2) / (this.scale * height/2);
    
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

    mandelbrotSetContains(kre: number, kim: number): boolean {
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
let ctx = canvas.getContext("2d")!;
let mandie = new MandelbrotRenderer(ctx);

mandie.draw();

