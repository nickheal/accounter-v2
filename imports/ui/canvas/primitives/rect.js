export default class Rect {
	constructor ({
		colour = '#333333',
		x = 0,
		y = 0,
		width = 1,
		height = 1
	}) {
		this.colour = colour;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw (ctx) {
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.x, ctx.canvas.height - this.y, this.width, this.height);
	}
}