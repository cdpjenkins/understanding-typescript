
var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;


function magnitudeSquared(re: number, im: number): number {
    return re*re + im*im;
}

function isInMandelbrotSet(kre: number, kim: number): boolean {
    let zre = 0;
    let zim = 0;

    for (let i = 0; i < 500; i++) {
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

function drawMandie() {
    console.time("mandie_timer");

    let width = canvas.width;
    let height = canvas.height;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let re = -2 + (4 / width) * x;
            let im = -2 + (4 / height) * y;

            if (isInMandelbrotSet(re, im)) {
                ctx.fillStyle = "#000000";
            } else {
                ctx.fillStyle = "#FFFFFF";
            }

            ctx.fillRect(x, y, 1, 1);
        }
    }

    console.timeEnd("mandie_timer");
}

drawMandie();

