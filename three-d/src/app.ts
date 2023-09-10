/// <reference path="LinearAlgebra.ts"/>
/// <reference path="SceneGraph.ts"/>


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

const NUM_PARTICLES = 50;

let particles: Particle[] = [];
for (let theta = 0; theta < Math.PI*2; theta += Math.PI / NUM_PARTICLES) {
    particles.push(
        new Particle(
            new Vector3D(
                Math.sin(theta) * 500,
                Math.cos(theta) * 500 + 300,
                700
            ),
            Vector3D.ZERO,
            5
        )
    )
}

for (let x = 0; x < 10; x++) {
    for (let z = 0; z < 10; z++) {
        particles.push(
            new Particle(
                new Vector3D(
                    (x - 5) * 500,
                    0,
                    (z) * 500
                ),
                Vector3D.ZERO,
                5
            )
        )
    }
}

let observer: Observer = new Observer(
    new Vector3D(0, 300, 0),
    0,
    Matrix3D.IDENTITY
)

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
        observer.rotate(Math.PI / 512);
    }
    if (keysDown.get('d')) {
        observer.rotate(-Math.PI / 512);
    }
    if (keysDown.get('w')) {
        observer.moveForwards(4);
    }
    if (keysDown.get('s')) {
        observer.moveBackwards(4);
    }
    if (keysDown.get('z')) {
        observer.moveLeft(4);
    }
    if (keysDown.get('x')) {
        observer.moveRight(4);
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

    const coordinateTransformMatrix = Matrix3D.coordinateTransformRotationAroundYAxis(observer.theta);

    for (const particle of particles) {
        particle.transformWorldToView(observer.pos, coordinateTransformMatrix);

        if (particle.viewPos.z > 0) {
            drawCircle(particle.viewPos, "rgb(255, 255, 255)", particle.radius);
        }
    }
}

function drawCircle(pos: Vector3D, rgb: string, radius: number) {
    let screenPos = projectViewToScreen(pos);

    // It's not great to have to compute the radius here (slightly incrrectly if the circle is actually
    // supposed to be a sphere) but hopefully something better will fall out eventually.
    radius = radius * PROJECTION_DEPTH / pos.z;

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();
}
