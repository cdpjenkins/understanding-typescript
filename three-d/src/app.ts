//
// Linear algebra stuff here
//

// TODO learn how multiple source files / modules / whatever work so we don't have to have everything in
// the same source file.
class Vector3D {
    constructor(
        public x: number,
        public y: number,
        public z: number
    ) {}
}

class Vector2D {
    constructor(
        public x: number,
        public y: number
    ) {}

    translate(that: Vector2D): Vector2D {
        return new Vector2D(this.x + that.x, this.y + that.y);
    }
}

class Matrix3D {
    constructor(
        public m11: number, public m21: number, public m31: number,
        public m12: number, public m22: number, public m32: number,
        public m13: number, public m23: number, public m33: number
    ) {}
}

//
// 3D stuff here
//

// Spaces:
// - Object space - object is at origin
// - World space - global origin, objects and observer have position and orientation in this space
// - View space - observer is at origin, z axis points forward
// - Screen space - 2D space, x axis points right, y axis points down
//
// There is kind of a missing space where we have projected a 3D vector into 2D space but haven't
// yet flipped the y axis and turned it into actual coordinates on the screen.

// We use a left-handed coordinate system for all 3D spaces where:
// x points right
// y points up
// z points forwards

function projectViewToScreen(s: Vector3D): Vector2D {
    let projectedX = s.x / s.z;
    let projectedY = s.y / s.z;

    let screenX = canvas.width / 2 + projectedX;
    let screenY = canvas.height / 2 + projectedY;

    return new Vector2D(screenX, screenY);
}


//
// Application stuff here
//

let keysDown = new Map<string, boolean>();

var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
document.addEventListener('keydown', function(e) {
    keysDown.set(e.key, true);
}, false);
document.addEventListener('keyup', function(e) {
    keysDown.set(e.key, false);
}, false);

var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

// in screen coords
// TODO how do we use the type system to differentiate between different coordinate systems?
let circlePos: Vector2D = new Vector2D(canvas.width/2, canvas.height/2);

setInterval(tick, 20)

function openFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if ((<any> canvas).webkitRequestFullscreen) {
        /* Safari */
        (<any> canvas).webkitRequestFullscreen();
    } else if ((<any> canvas).msRequestFullscreen) {
        /* IE11 */
        (<any> canvas).msRequestFullscreen();
  }
}

function handleKeys() {
    if (keysDown.get('a')) {
        circlePos = circlePos.translate(new Vector2D(-1, 0));
    }
    if (keysDown.get('w')) {
        circlePos = circlePos.translate(new Vector2D(0, -1));
    }
    if (keysDown.get('d')) {
        circlePos = circlePos.translate(new Vector2D(1, 0));
    }
    if (keysDown.get('s')) {
        circlePos = circlePos.translate(new Vector2D(0, 1));
    }
    if (keysDown.get('f')) {
        openFullscreen();
    }
}

function tick() {
    handleKeys();
    // updateStars();
    draw();
}

function clear() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();

    drawCircle(circlePos, "rgb(255, 255, 255)", 10);
}

function drawCircle(pos: Vector2D, rgb: string, radius: number) {
    console.log(`${pos.x}, ${pos.y}`);

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();
}
