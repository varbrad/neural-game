import { WIDTH, HEIGHT } from '../game';
import { random } from '../utils';

export default class Wall {
  /**
   * @param {number} x The starting x of the left-wall edge
   * @param {number} y The center of the gap
   * @param {number} gapSize The size of the gap
   */
  constructor(x, y, gapSize) {
    this.x = x || 0;
    this.y = y;
    this.size = gapSize;
    this.speed = 3;
    this.w = 32;

    if (this.size === undefined) this.size = random(90, 250);

    if (this.y === undefined) {
      // Random y
      this.setRandomY();
    }
  }

  setRandomY() {
    this.y = random(this.size * 0.5, HEIGHT - this.size * 0.5);
  }

  /**
   * Return true to remove bullet
   */
  update(gameSpeed) {
    this.x -= gameSpeed * this.speed;
    // If off-screen, return a remove flag
    if (this.x < -this.w) return true;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    gc.fillStyle = '#ffc0c0';
    // Top part
    gc.fillRect(this.x, 0, this.w, this.y - this.size * 0.5);
    // Bottom part
    gc.fillRect(
      this.x,
      this.y + this.size * 0.5,
      this.w,
      HEIGHT - this.y - this.size * 0.5
    );
  }
}
