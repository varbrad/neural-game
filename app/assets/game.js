import { Architect } from 'synaptic';

import Bullet from './game/bullet';
import Player from './game/player';
import Wall from './game/wall';
import { createSnapshot } from './snapshot';

/**
 * Start the game
 * @param {HTMLCanvasElement} canvas The canvas to begin the game on
 * @returns {Game} The game
 */
export function start(canvas, brain) {
  // Construct the game
  return new Game(canvas, brain);
}

export const WIDTH = 1300;
export const HEIGHT = 600;

class Game {
  /**
   * Create a new Game class
   * @param {HTMLCanvasElement} canvas The canvas
   */
  constructor(canvas, brain) {
    // Get sprites
    this.sprites = {
      enemy_1: document.getElementById('enemy_1'),
      enemy_2: document.getElementById('enemy_2'),
      player_blue: document.getElementById('player_blue'),
      player_bullet: document.getElementById('player_bullet'),
      player_orange: document.getElementById('player_orange'),
      player_red: document.getElementById('player_red')
    };

    this.canvas = canvas;
    this.gc = canvas.getContext('2d');
    this.isDebugMode = false;
    this.keys = {};
    this.player = new Player(this.sprites.player_blue, 16, HEIGHT / 2 - 16);
    this.bullets = [];
    this.walls = [];
    this.wallGap = 600;
    this.speed = 1;
    this.score = 0;
    this.isPaused = true;
    this.snapshot = null;
    this.keydownhandler = e => this.keydown(e);
    this.keyuphandler = e => this.keyup(e);

    this.useBrain = !!brain;
    this.brain = this.useBrain ? brain : new Architect.Perceptron(2, 6, 6, 3);
    this.learningRate = 0.05;

    // Register event handlers if brain is null
    if (!this.useBrain) {
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
    this.snapshot = createSnapshot(this);
    if (this.useBrain) {
      // Activate brain, use the input snapshot to generate keys
      // Map brain output to keystates
      const output = this.brain.activate(this.snapshot.input);
      // 0 = UP, 1 = DOWN, 2 = FIRE
      this.keys.KeyW = output[0] >= 0.5;
      this.keys.KeyS = output[1] >= 0.5;
      this.keys.Space = output[2] >= 0.5;
    } else {
      // Push snapshot through network brain to train
      // Activate the brain first
      this.brain.activate(this.snapshot.input);
      // Now back-prop with the output
      this.brain.propagate(this.learningRate, this.snapshot.output);
    }
    // Update the player
    this.player.update(this.speed, this.keys);
    // Does the player want to find a bullet
    if (this.player.wantsToFire) {
      this.player.fireWait = Math.floor(200 / 16); // Ticks to wait
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
    this.bullets.push(new Bullet(this.sprites.player_bullet, x, y, 1, 0, 8));
  }

  /**
   * @param {KeyboardEvent} e The keyboard event
   */
  keydown(e) {
    this.keys[e.code] = true;
    if (e.code === 'KeyP') {
      if (this.isPaused) this.resume();
      else this.pause();
    }
    e.preventDefault();
  }

  /**
   * @param {KeyboardEvent} e The keyboard event
   */
  keyup(e) {
    this.keys[e.code] = false;
    e.preventDefault();
  }

  debugMode(activate) {
    this.isDebugMode = activate;
  }
}
