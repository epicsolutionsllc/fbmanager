<template>
  <div class="loader-parent">
    <div class="loader"></div>
  </div>
</template>

<script>
export default {
  name: "ContentLoader",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader-parent {
  margin: auto;
  width: 100%;
  padding-bottom: 0.3em;
}

.loader {
  width: 20px;
  height: 20px;
  background: #ca0029;
  border-radius: 30px;
  margin: auto;
  animation: load 1s infinite;
}


.loader:after {
  display: block;
  content: ' ';
  width: 20px;
  height: 20px;
  background: #ca0029;
  border-radius: 30px;
  margin: auto;
  animation: load 1s 1s linear infinite;
}

@keyframes load {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}
</style>
