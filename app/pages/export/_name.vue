<template>
  <section class="export">
    <h1>
      {{ $route.params.name }}
      <span v-if="game" class="score">Score: {{ game.score }}</span>
      <span class="right small">Original Score: {{ score }}</span>
      <span class="small">Date: {{ formattedDate }}</span>
    </h1>
    <div class="content">
      <canvas id="canvas" ref="canvas" width="1500" height="600" :class="{ paused : game && game.isPaused }">
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
        <img src="/images/star.png" id="star"/>
      </canvas>
    </div>
    <div class="toolbar">
      <nuxt-link to="/"><i class="fas fa-home fa-fw"/> Home</nuxt-link>
    </div>
  </section>
</template>

<script>
import { Network } from 'synaptic';

import { start } from '@/assets/game';

export default {
  data() {
    const { brain, date, score } = JSON.parse(
      localStorage.getItem('neural:brain:' + this.$route.params.name)
    );
    return {
      brain: Network.fromJSON(brain),
      date,
      score,
      game: null
    };
  },
  mounted() {
    this.reset();
    document.addEventListener('keydown', this.keydown);
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydown);
    this.game.halt();
  },
  computed: {
    formattedDate() {
      const d = new Date(this.date);
      return (
        d.toLocaleDateString('en-GB') + ' @ ' + d.toLocaleTimeString('en-GB')
      );
    }
  },
  methods: {
    reset() {
      if (this.game) this.game.halt();
      this.game = start(this.$refs.canvas, this.brain);
    },
    keydown(e) {
      if (e.code === 'KeyR') {
        this.reset();
      }
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../assets/vars';

#canvas {
  transition: background-color 150ms ease-out, opacity 150ms ease-out;
  display: block;
  background-color: black;
  margin-bottom: 0;
  border-radius: 3px;
  margin: -0.5rem -1.5rem;

  &.paused {
    opacity: 0.5;
    background-color: rgba(0, 0, 90, 0.5);
  }
}

.export {
  padding: 1rem;
  background-color: $light;
  border-radius: 3px;
  overflow: hidden;

  > h1 {
    display: flex;
    padding: 1rem 2rem;
    margin: -1rem -1rem 0 -1rem;
    border-bottom: 1px solid $dark;
    font-size: 2rem;
    font-weight: 300;
    background-color: lighten($primary, 50%);
    color: $primary;
    align-items: center;

    > .score {
      font-weight: bold;
      font-size: 1rem;
      margin-left: 1rem;
    }

    > .small {
      font-size: 0.8rem;
      font-weight: bold;
      margin-left: 1rem;
      padding: 0.2rem 0.4rem;
      border: 1px solid rgba($dark, 0.2);
      background-color: rgba($light, 0.2);
      border-radius: 3px;
    }

    > .right {
      margin-left: auto;
    }
  }

  > .content {
    padding: 1rem;

    > p {
      &.small {
        font-size: 0.8rem;
        color: lighten($dark, 20%);
      }
      &.center {
        text-align: center;
      }
    }
  }

  > .toolbar {
    display: flex;
    margin: 0 -1rem -1rem -1rem;
    border-top: 1px solid darken($light, 5%);

    > a {
      padding: 0.5rem;
      margin: 0;
      font-size: 0.8rem;
      text-decoration: none;
      color: $primary;
      background-color: darken($light, 2%);

      > .svg-inline--fa {
        margin-right: 0.25rem;
      }

      &:hover {
        background-color: darken($light, 5%);
      }
    }
  }
}
</style>
