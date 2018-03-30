import { WIDTH, HEIGHT } from '../game';

export default class Player {
  /**
   * @param {Number} x Starting x-pos
   * @param {Number} y Starting y-pos
   */
  constructor(sprite, x, y) {
    this.sprite = sprite;
    this.x = x || 0;
    this.y = y || 0;
    this.dx = 0;
    this.dy = 0;
    this.w = 32;
    this.h = 32;
    this.acceleration = 1;
    this.wantsToFire = false;
    this.fireWait = 0;
  }

  update(speed, keys) {
    this.fireWait--;
    // if (keys.KeyA || keys.ArrowLeft) this.dx -= this.acceleration;
    // if (keys.KeyD || keys.ArrowRight) this.dx += this.acceleration;
    if (keys.KeyW || keys.ArrowUp) this.dy -= this.acceleration;
    if (keys.KeyS || keys.ArrowDown) this.dy += this.acceleration;
    if (keys.Space && this.fireWait <= 0) this.wantsToFire = true;

    this.dx *= 0.9;
    this.dy *= 0.9;

    if (Math.abs(this.dx) < this.acceleration * 0.2) this.dx = 0;
    if (Math.abs(this.dy) < this.acceleration * 0.2) this.dy = 0;

    this.x += this.dx;
    this.y += this.dy;

    // X-Bound checking
    if (this.x < 0 && this.dx < 0) {
      this.x = 0;
      this.dx *= -1;
    } else if (this.x > WIDTH - this.w && this.dx > 0) {
      this.x = WIDTH - this.w;
      this.dx *= -1;
    }
    // Y-Bound checking
    if (this.y < 0 && this.dy < 0) {
      this.y = 0;
      this.dy *= -1;
    } else if (this.y > HEIGHT - this.h && this.dy > 0) {
      this.y = HEIGHT - this.h;
      this.dy *= -1;
    }
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    if (!this.sprite) {
      gc.fillStyle = '#f29';
      gc.beginPath();
      gc.rect(this.x, this.y, this.w, this.h);
      gc.closePath();
      gc.fill();
    } else {
      gc.drawImage(this.sprite, this.x, this.y, this.w, this.h);
    }
  }
}
