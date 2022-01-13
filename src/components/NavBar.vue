<template>
  <div class="navbar">
    <img src="../assets/epic.svg">
    <a @click="logOut" class="button" v-if="isLoggedIn">Log Out</a>
    <h4 v-else>Facebook Admin</h4>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  emits: ["logOut"],
  methods: {
    logOut() {
      this.$emit('logOut');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  width: 100%;
  line-height: 1em;
  background: white;
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
}

img {
  height: 45px;
  padding: 7px 20px;
  padding-left: 0;
  margin-left: 2.5vw;
}

h4 {
  float: right;
  margin-top: 0.9rem;
  margin-right: 2.5vw;
}

a.button {
  float: right;
  margin: 5px;
  margin-right: 2.5vw;
}
</style>
