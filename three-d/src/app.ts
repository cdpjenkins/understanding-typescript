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
                5
            )
        )
    }
}

let observer: Observer = new Observer(
    new Vector3D(0, 300, 0),
    0,
    Matrix4x3.IDENTITY
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
    if (keysDown.get('q')) {
        observer.rotate(Math.PI / 512);
    }
    if (keysDown.get('e')) {
        observer.rotate(-Math.PI / 512);
    }
    if (keysDown.get('w')) {
        observer.moveForwards(4);
    }
    if (keysDown.get('s')) {
        observer.moveBackwards(4);
    }
    if (keysDown.get('a')) {
        observer.moveLeft(4);
    }
    if (keysDown.get('d')) {
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

    const translationMatrix = Matrix4x3.translation(observer.pos.negate());
    const rotationMatrix = Matrix4x3.coordinateTransformRotationAroundYAxis(observer.theta);

    const transform = rotationMatrix.transformMatrix(translationMatrix);

    for (const particle of particles) {
        particle.transformToViewSpace(transform);

        if (particle.viewPos.z > 0) {
            drawCircle(particle.viewPos, "rgb(255, 255, 255)", particle.radius);
        }
    }
}

function drawCircle(pos: Vector3D, rgb: string, radius: number) {
    let screenPos = observer.projectViewToScreen(pos);

    // It's not great to have to compute the radius here (slightly incrrectly if the circle is actually
    // supposed to be a sphere) but hopefully something better will fall out eventually.
    radius = radius * observer.PROJECTION_DEPTH / pos.z;

    ctx.beginPath();
    ctx.arc(screenPos.x, screenPos.y, radius, 0, 2*Math.PI);
    ctx.fillStyle = rgb;
    ctx.fill();
}
