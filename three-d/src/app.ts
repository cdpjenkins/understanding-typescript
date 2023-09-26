//
// Application stuff here
//

import { Matrix4x3, Vector4D } from "./linear-algebra";
import { Observer, Object3D, Scene, DirectionalLightSource } from "./scene-graph";
import { makeParticleFloor, makeSolidCube, makeSolidPyramid, makeThingie, makeVerticalCircle } from './object-3d';    
let keysDown = new Map<string, boolean>();

export var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
document.addEventListener('keydown', function(e) {
    keysDown.set(e.key, true);
}, false);
document.addEventListener('keyup', function(e) {
    keysDown.set(e.key, false);
}, false);

var ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

const cube = makeSolidCube(new Vector4D(400, 250, 1000));
const thingie = makeThingie(new Vector4D(0, 250, 1000));
const solidPyramid = makeSolidPyramid(new Vector4D(-400, 250, 1000));

function setupObjects(): Object3D[] {
    let objects: Object3D[] = [];

    for (let z = 300; z < 12000; z += 200) {
        objects.push(makeVerticalCircle(new Vector4D(0, 300, z), 1000));
    }

    objects.push(cube);
    // objects.push(wireframePyramid);
    objects.push(solidPyramid);
    objects.push(thingie);
    objects.push(makeParticleFloor());

    return objects;
}

let objects = setupObjects();

const scene: Scene = new Scene(
    new Observer(
        new Vector4D(0, 300, 0),
        0,
        Matrix4x3.IDENTITY,
        canvas.width,
        canvas.height
    ),
    new DirectionalLightSource(
        Vector4D.direction(0.3, -0.25, 1).normalise()
    )
);

setInterval(tick, 20)

// ignore unused for now because we're referencing directly from the HTML
// @ts-ignore
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
        scene.observer.yRotate(Math.PI / 512);
    }
    if (keysDown.get('e')) {
        scene.observer.yRotate(-Math.PI / 512);
    }
    if (keysDown.get('w')) {
        scene.observer.moveForwards(4);
    }
    if (keysDown.get('s')) {
        scene.observer.moveBackwards(4);
    }
    if (keysDown.get('a')) {
        scene.observer.moveLeft(4);
    }
    if (keysDown.get('d')) {
        scene.observer.moveRight(4);
    }
}

function updateObjects() {
    cube.yRotation += Math.PI / 1024;
    if (cube.yRotation >= Math.PI * 2) {
        cube.yRotation -= Math.PI * 2;
    }

    thingie.yRotation += Math.PI / 1024;
    if (thingie.yRotation >= Math.PI * 2) {
        thingie.yRotation -= Math.PI * 2;
    }

    solidPyramid.yRotation += Math.PI / 1024;
    if (solidPyramid.yRotation >= Math.PI * 2) {
        solidPyramid.yRotation -= Math.PI * 2;
    }
}

function tick() {
    handleKeys();
    updateObjects();
    scene.draw(ctx, objects, canvas.width, canvas.height);
}
