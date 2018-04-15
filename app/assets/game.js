import { Architect, Trainer } from 'synaptic';
import { shuffle } from 'lodash';

import Bullet from './game/bullet';
import Player from './game/player';
import Wall from './game/wall';
import { createSnapshot } from './snapshot';
import { aabb } from './utils';

/**
 * Start the game
 * @param {HTMLCanvasElement} canvas The canvas to begin the game on
 * @returns {Game} The game
 */
export function start(canvas, brain) {
  // Construct the game
  return new Game(canvas, brain);
}

export const WIDTH = 1500;
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
    this.speed = 3;
    this.score = 0;
    this.isPaused = true;
    this.snapshot = null;
    this.snapshots = [];
    this.keydownhandler = e => this.keydown(e);
    this.keyuphandler = e => this.keyup(e);

    this.useBrain = !!brain;
    this.brain = this.useBrain ? brain : new Architect.Perceptron(5, 6, 6, 3);

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

  train(callback) {
    this.halt();
    const trainer = new Trainer(this.brain);
    return trainer.trainAsync(shuffle(this.snapshots), {
      iterations: 25000,
      rate: 0.05,
      schedule: {
        every: 500,
        do: callback
      }
    });
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
    this.learningRate *= 0.999;
    // Update the walls
    const maxWallX = this.walls.reduce((p, c) => (c.x > p ? c.x : p), 0);
    this.walls.forEach((w, i) => {
      if (w.update(this.speed)) {
        // This wall needs to move
        w.x = maxWallX + this.wallGap;
        // Randomize the wall
        w.setRandomY();
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
      this.snapshots.push(this.snapshot);
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

    // Collision checks
    this.collisionChecks();

    // Tick score
    this.score += 1;
    // Draw the scene
    this.draw();
  }

  collisionChecks() {
    // Is the player colliding with a wall?
    // Loop thru all bullets
    this.bullets.forEach((b, i) => {
      // Loop thru walls
      this.walls.forEach(w => {
        // Are they colliding?
        let rects = this.wallRectangles(w);
        rects.forEach(r => {
          if (aabb(b, r)) {
            this.bullets.splice(i, 1);
          }
        });
      });
    });
  }

  wallRectangles(w) {
    let wallX = w.x;
    let top = {
      x: wallX,
      y: 0,
      w: w.w,
      h: w.y - w.size * 0.5
    };
    let bottom = {
      x: wallX,
      y: w.y + w.size * 0.5,
      w: w.w,
      h: HEIGHT - w.y - w.size * 0.5
    };
    return [top, bottom];
  }

  draw() {
    this.gc.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw bullets
    this.bullets.forEach(b => b.draw(this.gc));
    this.player.draw(this.gc);
    this.walls.forEach(w => w.draw(this.gc));

    if (this.isDebugMode) {
      // Draw hit boxes
      // Player
      this.gc.strokeStyle = 'red';
      this.gc.lineWidth = 2;
      this.gc.strokeRect(
        this.player.x,
        this.player.y,
        this.player.w,
        this.player.h
      );
      // Bullets
      this.bullets.forEach(b => {
        this.gc.strokeRect(b.x, b.y, b.w, b.h);
      });
      // Walls
      this.walls.forEach(w => {
        const parts = this.wallRectangles(w);
        parts.forEach(p => {
          this.gc.strokeRect(p.x, p.y, p.w, p.h);
        });
      });
    }
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
    } else if (e.code === 'BracketLeft') {
      // Toggle debug
      this.debugMode(!this.isDebugMode);
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
