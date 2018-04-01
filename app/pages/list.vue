<template>
  <section class="list">
    <h1>Generated AI</h1>
    <div class="list">
      <div class="list-item" v-for="(ai, i) in ais" :key="ai.date">
        <p class="rank">{{ i + 1 }}.</p>
        <nuxt-link :to="'/export/' + ai.name">{{ ai.name }}</nuxt-link>
        <p class="big">Score: {{ ai.score }}</p>
        <p class="small">{{ formatDate(ai.date) }}</p>
        <p class="small"><strong>Error</strong><br>{{ (ai.error * 100).toFixed(2) }}%</p>
        <p class="small"><strong>Timings</strong><br>{{ (ai.time / 1000).toFixed(1) }}k</p>
        <a href="#" @click="remove(i)"><i class="fas fa-trash-alt fa-fw"/> DELETE</a>
      </div>
    </div>
    <div class="toolbar">
      <a class="btn" href="#" @click="removeBoring()"><i class="fas fa-trash fa-fw"/> Remove Boring</a>
      <nuxt-link to="/"><i class="fas fa-caret-square-left fa-fw"/> Go Back</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    const items = [];
    for (let i = 0; i < localStorage.length; ++i) {
      const key = localStorage.key(i);
      const match = /neural:brain:/.test(key);
      if (match) {
        items.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    items.sort((a, b) => b.score - a.score);
    return {
      ais: items
    };
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return (
        d.toLocaleDateString('en-GB') + ' @ ' + d.toLocaleTimeString('en-GB')
      );
    },
    removeBoring() {
      for (let i = this.ais.length - 1; i >= 0; --i) {
        const ai = this.ais[i];
        // Remove any with an error > .05 or a score < 1000
        if (ai.error < 0.05 && ai.score > 1000) continue;
        this.remove(i);
      }
    },
    remove(i) {
      const ai = this.ais[i];
      this.ais.splice(i, 1);
      localStorage.removeItem('neural:brain:' + ai.name);
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/vars';

.list {
  padding: 1rem;
  background-color: $light;
  border-radius: 3px;

  > h1 {
    padding: 1rem 2rem;
    margin: -1rem -1rem 1rem -1rem;
    border-bottom: 1px solid $dark;
    font-size: 2rem;
    font-weight: 300;
    background-color: lighten($primary, 50%);
    color: $primary;
  }

  > .list {
    border: 1px solid darken($light, 5%);
    max-height: 50vh;
    overflow-y: auto;

    > .list-item {
      display: grid;
      align-items: center;
      padding: 0.5rem;
      grid-template-columns: 3rem 2fr 1fr 1fr 1fr 1fr 1fr;

      > p,
      > a {
        text-align: center;

        &.small {
          font-size: 0.8rem;
          color: lighten($dark, 20%);
        }

        &.big {
          color: $primary;
          font-weight: bold;
        }
      }

      > a {
        text-decoration: none;
        color: $primary;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  > .notice {
    text-align: center;
    max-width: 460px;
    margin: 0 auto;
    font-size: 0.9rem;
    font-weight: bold;
    padding: 1rem;
  }

  > .toolbar {
    transition: background-color 150ms ease-out;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 -1rem -1rem -1rem;

    &.hover {
      background-color: rgba($primary, 0.8);

      > .side {
        transform: scale(0.7);
      }
    }

    a {
      padding: 0.5rem;
      font-size: 0.8rem;
      border: 1px solid darken($light, 5%);
      margin: 0 0.5rem;
      border-radius: 3px;
      text-decoration: none;
      color: $primary;

      &:hover {
        background-color: darken($light, 5%);
      }
    }
  }
}
</style>
