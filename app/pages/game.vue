<template>
  <canvas id="canvas" ref="canvas"/>
</template>

<script>
export default {
  mounted() {
    let c = this.$refs.canvas;
    c.width = 900;
    c.height = 600;
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/vars';

#canvas {
  background-color: $light;
  box-shadow: 0 3px 9px rgba($dark, 0.5);
  border-radius: 3px;
}
</style>
