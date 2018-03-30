<template>
  <div class="game">
    <template v-if="data === null">
      <div class="toolbar">
        <a href="#" class="btn no-margin" :class="{ active: debugMode }" @click="toggleDebug()"><i class="fas fa-code fa-fw"/> Debug</a>
        <a href="#" class="btn small" @click="showSnapshot()"><i class="fas fa-camera-retro fa-fw"/> Log Snapshot</a>
        <a href="#" class="btn small" @click="showBrain()"><i class="fas fa-code-branch fa-fw"/> Log Brain</a>
        <p>{{ name }}</p>
        <a href="#" class="btn small active" @click="doExport()"><i class="fas fa-check fa-fw"/> Export</a>
        <hr>
        <p v-if="game">Score: {{ game.score }}</p>
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
      <div class="toolbar-container dark" v-if="game">
        <div class="toolbar dark">
          <pre>State Snapshot: {{ this.game.snapshot }}</pre>
        </div>
      </div>
    </template>
    <div class="data-block" v-if="data">
      <h1>Training AI</h1>
      <progress max="25000" :value="data.iterations"/>
      <p class="data">Iterations: {{ data.iterations }} / 25000</p>
      <p class="data">Error Rate: {{ data.error.toFixed(5) }}</p>
      <p class="data">Learning Rate: {{ data.rate }}</p>
      <p class="data">Snapshots: {{ game.snapshots.length }}</p>
    </div>
  </div>
</template>

<script>
import { start } from '@/assets/game';
import { getFunName } from '@/assets/helpers';

export default {
  data() {
    return {
      debugMode: false,
      game: null,
      name: getFunName(),
      data: null
    };
  },
  mounted() {
    this.reset();
  },
  beforeDestroy() {
    if (this.game) this.game.halt();
  },
  methods: {
    async doExport() {
      // Train the brain
      const fn = data => (this.data = data);
      const r = await this.game.train(fn);
      // OK, brain trained!
      const score = this.game.score;
      const brain = this.game.brain.toJSON();
      // Store the brain, and score!
      const data = {
        score,
        brain,
        date: Date.now(),
        name: this.name,
        error: r.error,
        time: r.time
      };
      // Push to localstorage
      localStorage.setItem('neural:brain:' + this.name, JSON.stringify(data));
      //
      this.$router.push('/export/' + this.name);
    },
    reset() {
      if (this.game) this.game.halt();
      if (!this.$refs.canvas) return;
      this.game = start(this.$refs.canvas);
    },
    pause() {
      this.game.pause();
    },
    play() {
      this.game.resume();
    },
    showBrain() {
      console.log(this.game.brain);
    },
    showSnapshot() {
      console.log(JSON.stringify(this.game.snapshot));
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
  background-color: #456;
  border-top: 4px solid $primary;
  margin-bottom: 0;

  &.paused {
    opacity: 0.5;
    background-color: rgba(0, 0, 90, 0.5);
  }
}

.data-block {
  padding: 1rem;
  color: $primary;
  font-weight: bold;
  font-size: 0.8rem;

  > h1 {
    margin: -1rem -1rem 1rem -1rem;
    padding: 1rem;
    background-color: darken($light, 2%);
    border-bottom: 1px solid darken($light, 5%);
    font-size: 1.2rem;
  }
}

.toolbar-container {
  &.dark {
    background-color: $dark;
  }
}

.game {
  background-color: $light;
  border-radius: 3px;
  box-shadow: 0 3px 9px rgba($dark, 0.5);

  .toolbar {
    transition: opacity 300ms ease-out;
    display: flex;
    align-items: center;
    padding: 0.3rem;
    color: $primary;

    &.invisible {
      opacity: 0;
    }

    &.dark {
      color: lighten($primary, 30%);
    }

    > hr {
      flex: 1;
      visibility: hidden;
    }

    > p,
    > pre {
      padding: 0.3rem 0.5rem;
      font-size: 0.8rem;
      font-weight: bold;
    }

    > a.btn {
      border: 1px solid darken($light, 5%);
      border-radius: 3px;
      font-size: 0.8rem;
      padding: 0.3rem 0.5rem;
      font-weight: bold;
      text-decoration: none;
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
