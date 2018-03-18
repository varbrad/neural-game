<template>
  <div class="game">
    <div class="toolbar">
      <a href="#" class="btn" :class="{ active: debugMode }" @click="toggleDebug()"><i class="fas fa-code fa-fw"/> Debug</a>
      <hr>
      <nuxt-link to="/" class="btn"><i class="fas fa-caret-square-left fa-fw"/> Go Back</nuxt-link>
    </div>
    <canvas id="canvas" ref="canvas" width="900" height="600"/>
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
    let c = this.$refs.canvas;
    this.game = start(c);
  },
  methods: {
    toggleDebug() {
      this.debugMode = !this.debugMode;
      console.log(this.game);
      this.game.debugMode(this.debugMode);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/vars';

.game {
  background-color: $light;
  border-radius: 3px;
  box-shadow: 0 3px 9px rgba($dark, 0.5);

  > .toolbar {
    display: flex;
    padding: 0.3rem;

    > hr {
      flex: 1;
      visibility: hidden;
    }

    > a.btn {
      border: 1px solid darken($light, 5%);
      border-radius: 3px;
      font-size: 0.8rem;
      padding: 0.3rem 0.5rem;
      font-weight: bold;
      text-decoration: none;
      color: $primary;

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
