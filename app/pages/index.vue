<template>
  <section class="index">
    <h1>Activity Consent</h1>
    <div class="toolbar top">
      <nuxt-link class="left-margin" to="/list"><i class="fas fa-list-ol fa-fw"/> View Generated AI Agents</nuxt-link>
    </div>
    <div class="list">
      <p class="item" v-for="(item, i) in checklist" :key="i">
        <span class="no">{{ i + 1 }}</span>
        <span class="text">{{ item }}</span>
      </p>
    </div>
    <div class="notice">
      <p>By clicking 'I Agree to Participate' below, you are confirming that you have read the provided information sheet and are happy to proceed.</p>
    </div>
    <div class="toolbar" :class="{hover}">
      <div class="side">
        <img src="/images/player_blue.png"/>
        <img src="/images/player_bullet.png"/>
      </div>
      <button @click="start()" @mouseover="hover = true" @mouseout="hover = false"><i class="fas fa-check fa-fw"/> I Agree to Participate</button>
      <div class="side">
        <img src="/images/enemy_bullet.png"/>
        <img src="/images/enemy_1.png"/>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      hover: false,
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
    margin: -1rem -1rem 1rem -1rem;

    > p {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;

      > .no {
        padding: 1rem 2rem;
        font-size: 1.5rem;
        font-weight: 700;
        color: $primary;
      }

      > .text {
        flex: 1;
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

    &.top {
      margin: -1rem -1rem 0 -1rem;

      > .left-margin {
        margin-left: auto;
      }
    }

    &.hover {
      background-color: rgba($primary, 0.8);

      > .side {
        transform: scale(0.7);
      }
    }

    > .side {
      transition: transform 300ms ease-out;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-around;
      transform: scale(0.5);
    }

    > a {
      font-size: 0.8rem;
      padding: 0.4rem 0.6rem;
      border: 1px solid darken($light, 10%);
      border-radius: 3px;
      color: $primary;
      text-decoration: none;

      &:hover {
        background-color: darken($light, 5%);
      }
    }

    > button {
      transition: all 150ms ease-out;
      cursor: pointer;
      padding: 1rem 2rem;
      background: lighten($primary, 20%);
      border-radius: 999px;
      border: none;
      color: $light;
      font-weight: bold;

      &:hover {
        background: $primary;
        transform: scale(1.1);
        text-decoration: underline;
        outline: none;
      }
    }
  }
}
</style>
