class Baddie implements Entity {
    update(): void {
        console.log("update!");
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(800, 300, 35, 0, 2*Math.PI);
        ctx.fillStyle = "#00FFFF";
        ctx.fill();
    
        console.log("draw!");
    }
}

