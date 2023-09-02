class Complex {
    constructor(
        public re: number,
        public im: number
    ) {}
}

class MandelbrotRenderer {
    centre: Complex = new Complex(0, 0);
    scale: number = 1;
    iterationDepth: number = 1000;

    draw() {
        console.time("mandie_timer");
    
        let width = canvas.width;
        let height = canvas.height;
    
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let re = -2 + (4 / width) * x;
                let im = -2 + (4 / height) * y;
    
                if (this.mandelbrotSetContains(re, im)) {
                    ctx.fillStyle = "#000000";
                } else {
                    ctx.fillStyle = "#FFFFFF";
                }
    
                ctx.fillRect(x, y, 1, 1);
            }
        }
    
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

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;


function magnitudeSquared(re: number, im: number): number {
    return re*re + im*im;
}


let mandie = new MandelbrotRenderer();

mandie.draw();

