import { WIDTH, HEIGHT } from '../game';

export default class Enemy {
  /**
   * @param {Number} x Starting x-pos
   * @param {Number} y Starting y-pos
   */
  constructor(x, y, sprite) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = 48;
    this.h = 48;
    this.x -= this.w * 0.5;
    this.y -= this.h * 0.5;
    this.speed = 3;
    this.sprite = sprite;
    this.wantsToFire = false;
    this.fireWait = 0;
  }

  /**
   * Return true to remove bullet
   */
  update(gameSpeed) {
    this.fireWait--;

    if (this.fireWait <= 0) this.wantsToFire = true;

    this.x -= gameSpeed * this.speed;
    // If off-screen, return a remove flag
    if (this.x < -this.w) return true;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    gc.drawImage(this.sprite, this.x, this.y, this.w, this.h);
  }
}
