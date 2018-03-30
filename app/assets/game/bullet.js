import { WIDTH, HEIGHT } from '../game';

export default class Bullet {
  /**
   * @param {Number} x Starting x-pos
   * @param {Number} y Starting y-pos
   */
  constructor(sprite, x, y, dx, dy, speed, label) {
    this.sprite = sprite;
    this.x = x || 0;
    this.y = y || 0;
    this.dx = dx || 0;
    this.dy = dy || 0;
    this.r = 5;
    this.speed = speed;
    this.label = label || '?';
  }

  /**
   * Return true to remove bullet
   */
  update(gameSpeed) {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    // If off-screen, return a remove flag
    if (this.x > WIDTH + this.r * 2) return true;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    if (!this.sprite) {
      gc.fillStyle = '#f11';
      gc.save();
      gc.translate(this.x, this.y);
      gc.rotate(0.785); // 45 degrees
      gc.beginPath();
      gc.rect(-this.r, -this.r, this.r * 2, this.r * 2);
      gc.closePath();
      gc.fill();
      gc.restore();
    } else {
      gc.drawImage(
        this.sprite,
        this.x,
        this.y - this.r,
        this.r * 6,
        this.r * 2
      );
    }
  }
}
