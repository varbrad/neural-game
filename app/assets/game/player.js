export default class Player {
  /**
   * @param {Number} x Starting x-pos
   * @param {Number} y Starting y-pos
   */
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.dx = 0;
    this.dy = 0;
    this.acceleration = 1;
    this.wantsToFire = false;
    this.fireWait = 0;
  }

  update(keys) {
    this.fireWait--;
    if (keys.KeyA || keys.ArrowLeft) this.dx -= this.acceleration;
    if (keys.KeyD || keys.ArrowRight) this.dx += this.acceleration;
    if (keys.KeyW || keys.ArrowUp) this.dy -= this.acceleration;
    if (keys.KeyS || keys.ArrowDown) this.dy += this.acceleration;
    if (keys.Space && this.fireWait <= 0) this.wantsToFire = true;

    this.dx *= 0.95;
    this.dy *= 0.95;

    if (Math.abs(this.dx) < this.acceleration * 0.2) this.dx = 0;
    if (Math.abs(this.dy) < this.acceleration * 0.2) this.dy = 0;

    this.x += this.dx;
    this.y += this.dy;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    gc.fillStyle = 'red';
    gc.beginPath();
    gc.rect(this.x, this.y, 32, 32);
    gc.closePath();
    gc.fill();
  }
}
