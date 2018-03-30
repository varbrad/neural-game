import Bullet from './game/bullet';
import Player from './game/player';
import Wall from './game/wall';
import { createSnapshot } from './snapshot';

/**
 * Start the game
 * @param {HTMLCanvasElement} canvas The canvas to begin the game on
 * @returns {Game} The game
 */
export function start(canvas) {
  // Construct the game
  return new Game(canvas);
}

export const WIDTH = 1300;
export const HEIGHT = 600;

class Game {
  /**
   * Create a new Game class
   * @param {HTMLCanvasElement} canvas The canvas
   */
  constructor(canvas, brain) {
    this.canvas = canvas;
    this.gc = canvas.getContext('2d');
    this.isDebugMode = false;
    this.keys = {};
    this.player = new Player(16, HEIGHT / 2 - 16);
    this.brain = brain;
    this.bullets = [];
    this.walls = [];
    this.wallGap = 600;
    this.speed = 1;
    this.score = 0;
    this.snapshots = [];
    this.isPaused = true;
    this.keydownhandler = e => this.keydown(e);
    this.keyuphandler = e => this.keyup(e);

    // Register event handlers if brain is null
    if (undefined === this.brain) {
      document.addEventListener('keydown', this.keydownhandler, false);
      document.addEventListener('keyup', this.keyuphandler, false);
    }

    // Setup initial 5 walls (enough to cover entire screen)
    for (let i = 0; i < 5; ++i) {
      const wall = new Wall(WIDTH + this.wallGap * i);
      this.walls.push(wall);
    }

    // Begin update loop
    this.resume();
  }

  pause() {
    if (this.isPaused) return;
    this.isPaused = true;
    clearInterval(this.interval);
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.interval = setInterval(_ => {
      this.update();
    }, 16); // 60FPS
  }

  halt() {
    document.removeEventListener('keydown', this.keydownhandler);
    document.removeEventListener('keyup', this.keyuphandler);
    clearInterval(this.interval);
  }

  update() {
    // Update the walls
    const maxWallX = this.walls.reduce((p, c) => (c.x > p ? c.x : p), 0);
    this.walls.forEach((w, i) => {
      if (w.update(this.speed)) {
        // This wall needs to move
        w.x = maxWallX + this.wallGap;
        // Award some points!
        this.score += 50;
      }
    });
    // OK, if we have a brain, get our keystates
    if (this.brain) {
      // Activate brain
      // Map brain output to keystates
    } else {
      // No thingy, so take a snapshot of current game state
      // And map to key states
      const snapshot = createSnapshot(this);
      this.snapshots.push(snapshot);
    }
    // Update the player
    this.player.update(this.speed, this.keys);
    // Does the player want to find a bullet
    if (this.player.wantsToFire) {
      this.player.fireWait = Math.floor(200 / this.speed / 16); // Ticks to wait
      this.player.wantsToFire = false;
      this.firePlayerBullet(
        this.player.x + this.player.w * 0.5,
        this.player.y + this.player.h * 0.5
      );
    }
    // Update bullets
    this.bullets.forEach((b, i) => {
      const remove = b.update(this.speed);
      if (remove) this.bullets.splice(i, 1);
    });
    // Tick score
    this.score += 1;
    //
    this.draw();
  }

  draw() {
    this.gc.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw bullets
    this.bullets.forEach(b => b.draw(this.gc));
    this.player.draw(this.gc);
    this.walls.forEach(w => w.draw(this.gc));
  }

  firePlayerBullet(x, y) {
    this.bullets.push(new Bullet(x, y, 1, 0, 8));
  }

  /**
   * @param {KeyboardEvent} e The keyboard event
   */
  keydown(e) {
    this.keys[e.code] = true;
  }

  /**
   * @param {KeyboardEvent} e The keyboard event
   */
  keyup(e) {
    this.keys[e.code] = false;
  }

  debugMode(activate) {
    this.isDebugMode = activate;
  }
}
