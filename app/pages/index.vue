<template>
  <section class="index">
    <h1>Activity Consent</h1>
    <div class="list">
      <p class="item" v-for="(item, i) in checklist" :key="i">
        <span class="no">{{ i + 1 }}.</span>
        <span class="text">{{ item }}</span>
      </p>
    </div>
    <div class="notice">
      <p>By clicking 'I Agree to Participate' below, you are confirming that you have read the provided information sheet and are happy to proceed.</p>
    </div>
    <div class="toolbar">
      <button @click="start()"><i class="fas fa-check fa-fw"/> I Agree to Participate</button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      checklist: [
        'I have received and read the provided Participant Information Sheet.',
        'The activity has been fully explained, and I understand what my participation will involve.',
        'I understand that my participation is entirely voluntary, and that I am free to withdraw at any time.',
        'I understand how the data I provide will be used and stored in the research process.'
      ]
    };
  },
  methods: {
    start() {
      this.$router.push('/game');
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/vars';

.index {
  background-color: $dark;
  color: $light;
  max-width: $max-width;
  border-radius: 3px;
  overflow: hidden;

  > h1 {
    color: $dark;
    background-color: $primary;
    padding: 1rem;
    margin: 0;
    box-shadow: inset 0 -5px 0 $dark;
    border-bottom: 5px solid $primary;
  }

  > .list {
    > .item {
      display: flex;
      align-items: center;

      &:nth-child(odd) {
        background-color: rgba($light, 0.05);
      }

      > .no {
        padding: 1.5rem 2rem;
        color: $primary;
        font-weight: 600;
        font-size: 1.5rem;
      }

      > .text {
        font-size: 1.1rem;
      }
    }
  }

  > .notice {
    padding: 1rem 2rem;
    margin: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    background-color: rgba(black, 0.25);
    border-radius: 5px;
  }

  > .toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem;

    > button {
      transition: transform 300ms ease-out, background-color 150ms ease-out;
      cursor: pointer;
      padding: 1rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 999px;
      background-color: $light;
      outline: none;

      &.disabled {
        opacity: 0.1;
        transform: scale(0.8);
      }

      &:hover {
        transform: scale(1.1);
        background-color: $primary;
      }
    }
  }
}
</style>
