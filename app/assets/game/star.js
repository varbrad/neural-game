import { WIDTH, HEIGHT } from '../game';
import { random } from '../utils';

export default class Star {
  /**
   * @param {number} x The starting x of the star
   * @param {number} y The starting y of the star
   * @param {number} gapSize The size of the star
   */
  constructor(sprite, x, y, size) {
    this.sprite = sprite;
    this.x = x || random(0, WIDTH);
    this.y = y || random(0, HEIGHT);
    this.size = size || random(16, 82);
    this.speed = this.size / 20;
  }

  /**
   * Return true to remove bullet
   */
  update(gameSpeed) {
    this.x -= gameSpeed * this.speed;
    // If off-screen, return a remove flag
    if (this.x < -this.size) return true;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    gc.fillStyle = 'white';
    gc.drawImage(this.sprite, this.x, this.y, this.size, this.size);
  }
}
