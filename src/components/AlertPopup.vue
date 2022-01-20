<template>
  <div class="alert">
    <h3>{{ action }}</h3>
    <p>{{ description }}</p>
    <div class="choices">
      <a class="button button-outline" @click="$emit('choice', {val: 0, action})">{{
        choices[0]
      }}</a>
      <a class="button" @click="$emit('choice', {val: 1, action})">{{ choices[1] }}</a>
    </div>
  </div>
  <div class="alert-shade" @click="$emit('choice', {val: 0, action})"></div>
</template>

<script>
export default {
  name: "AlertPopup",
  props: {
    choices: Array,
    description: String,
    action: String,
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
  padding: 1.5em;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
}

a:not(.button) {
  color: #ca0029;
}

a.button {
  margin-right: 5px;
}

.alert-shade {
  height: calc(100vh - 48px);
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  position: absolute;
  top: 48px;
  left: 0;
  z-index: 3;
}

h3 {
  text-transform: capitalize;
}
</style>
