import Player from '@/assets/game/player';

/**
 * Start the game
 * @param {HTMLCanvasElement} canvas The canvas to begin the game on
 * @returns {Game} The game
 */
export function start(canvas) {
  // Construct the game
  return new Game(canvas);
}

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
    this.width = 900;
    this.height = 600;
    this.player = new Player(434, 558);
    this.brain = brain;
    this.bullets = [];

    // Register event handlers if brain is null
    if (undefined === this.brain) {
      document.addEventListener('keydown', e => this.keydown(e), false);
      document.addEventListener('keyup', e => this.keyup(e), false);
    }

    // Begin update loop
    this.interval = setInterval(_ => {
      this.update();
    }, 33); // 30FPS
  }

  update() {
    // Update the player
    this.player.update(this.keys);
    // Does the player want to find a bullet
    if (this.player.wantsToFire) {
      this.player.fireWait = Math.floor(500 / 33); // Ticks to wait
      this.player.wantsToFire = false;
      this.firePlayerBullet(this.player.x, this.player.y);
    }
    //
    this.draw();
  }

  draw() {
    this.gc.clearRect(0, 0, this.width, this.height);
    this.player.draw(this.gc);
  }

  firePlayerBullet(x, y) {
    // TODO: Fire player bullet
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
