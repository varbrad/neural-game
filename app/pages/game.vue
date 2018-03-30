<template>
  <div class="game">
    <div class="toolbar">
      <a href="#" class="btn no-margin" :class="{ active: debugMode }" @click="toggleDebug()"><i class="fas fa-code fa-fw"/> Debug</a>
      <p v-if="game">Score: {{ game.score }}</p>
      <p v-if="game">Snapshots: {{ game.snapshots.length }}</p>
      <a href="#" class="btn small" @click="showSnapshot()"><i class="fas fa-camera-retro fa-fw"/> Log Snapshot</a>
      <hr>
      <a href="#" class="btn" @click="reset()"><i class="fas fa-undo-alt fa-fw"/> Reset</a>
      <a href="#" class="btn" @click="pause()" v-if="game && !game.isPaused" key="pause">
        <i class="fas fa-pause fa-fw"/> Pause
      </a>
      <a href="#" class="btn" @click="play()" v-if="game && game.isPaused" key="play">
        <i class="fas fa-play fa-fw"/> Play
      </a>
      <nuxt-link to="/" class="btn"><i class="fas fa-caret-square-left fa-fw"/> Go Back</nuxt-link>
    </div>
    <canvas id="canvas" ref="canvas" width="1300" height="600" :class="{ paused : game && game.isPaused }">
      <img src="/images/enemy_1.png" id="enemy_1"/>
      <img src="/images/enemy_2.png" id="enemy_2"/>
      <img src="/images/enemy_3.png" id="enemy_3"/>
      <img src="/images/enemy_4.png" id="enemy_4"/>
      <img src="/images/enemy_5.png" id="enemy_5"/>
      <img src="/images/enemy_bullet.png" id="enemy_bullet"/>
      <img src="/images/player_blue.png" id="player_blue"/>
      <img src="/images/player_bullet.png" id="player_bullet"/>
      <img src="/images/player_green.png" id="player_green"/>
      <img src="/images/player_orange.png" id="player_orange"/>
      <img src="/images/player_red.png" id="player_red"/>
    </canvas>
  </div>
</template>

<script>
import { start } from '@/assets/game';

export default {
  data() {
    return {
      debugMode: false,
      game: null
    };
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      if (this.game) this.game.halt();
      this.game = start(this.$refs.canvas);
    },
    pause() {
      this.game.pause();
    },
    play() {
      this.game.resume();
    },
    showSnapshot() {
      console.log(
        JSON.stringify(this.game.snapshots[this.game.snapshots.length - 1])
      );
    },
    toggleDebug() {
      this.debugMode = !this.debugMode;
      this.game.debugMode(this.debugMode);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/vars';

#canvas {
  transition: background-color 150ms ease-out, opacity 150ms ease-out;
  display: block;
  background-color: rgba(0, 0, 190, 0.05);
  border-top: 4px solid #444;
  margin-bottom: 0;

  &.paused {
    opacity: 0.5;
    background-color: rgba(0, 0, 90, 0.5);
  }
}

.game {
  background-color: $light;
  border-radius: 3px;
  box-shadow: 0 3px 9px rgba($dark, 0.5);

  > .toolbar {
    display: flex;
    align-items: center;
    padding: 0.3rem;

    > hr {
      flex: 1;
      visibility: hidden;
    }

    > p {
      padding: 0.3rem 0.5rem;
      font-size: 0.8rem;
      font-weight: bold;
      color: $primary;
    }

    > a.btn {
      border: 1px solid darken($light, 5%);
      border-radius: 3px;
      font-size: 0.8rem;
      padding: 0.3rem 0.5rem;
      font-weight: bold;
      text-decoration: none;
      color: $primary;
      margin-left: 0.5rem;

      &.no-margin {
        margin: 0;
      }

      &.small {
        font-size: 0.8rem;
        padding: 0.2rem 0.4rem;
        font-weight: 300;
      }

      > .svg-inline--fa {
        margin-right: 0.3rem;
      }

      &:hover {
        background: darken($light, 3%);
      }

      &.active {
        background: $primary;
        color: $light;

        &:hover {
          background: lighten($primary, 20%);
        }
      }
    }
  }
}
</style>
