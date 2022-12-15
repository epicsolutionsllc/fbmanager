<template>
  <div class="alert">
    <h3>{{ action }}</h3>
    <p v-html="description"></p>
    <div class="choices">
      <a class="button button-outline" @click="$emit('choice', { val: 0, action })">{{
          choices[0]
      }}</a>
      <a class="button" @click="$emit('choice', { val: 1, action })">{{ choices[1] }}</a>
    </div>
  </div>
  <div :class="{ alertShade: true, contained: contained }" @click="$emit('choice', { val: 0, action })"></div>
</template>

<script>
export default {
  name: "AlertPopup",
  props: {
    choices: Array,
    description: String,
    action: String,
    contained: Boolean
  },
  emits: ["choice"],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.alert {
  position: relative;
  text-align: left;
  width: max-content;
  max-width: 85vw;
  padding: 1.5em;
  border-radius: 5px;
  background: var(--bg-1);
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
}

a:not(.button) {
  color: var(--accent);
}

a.button {
  margin-right: 5px;
}

.alertShade {
  height: calc(100vh - 48px);
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
}

.contained {
  height: calc(100vh - 16rem);
  border-radius: 0.5em;
}

h3 {
  text-transform: capitalize;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
