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
    this.w = 30;
    this.h = 10;
    this.y -= 5;
    this.speed = speed;
    this.label = label || '?';
    this.hitbox = {
      x: 0,
      y: 0,
      w: this.w,
      h: this.h
    };
  }

  /**
   * Return true to remove bullet
   */
  update(gameSpeed) {
    this.x += this.dx * this.speed * gameSpeed;
    this.y += this.dy * this.speed * gameSpeed;
    // If off-screen, return a remove flag
    if (this.x > WIDTH + this.r * 2) return true;
  }

  /**
   * Draw the player
   * @param {CanvasRenderingContext2D} gc The graphics context
   */
  draw(gc) {
    gc.drawImage(this.sprite, this.x, this.y, this.w, this.h);
  }
}
