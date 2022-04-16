class Player implements Entity {
    update(): void {
        console.log("update!");
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#FF00FF";
        ctx.fillRect(450, 450, 100, 100);

        console.log("draw!");
    }
}

