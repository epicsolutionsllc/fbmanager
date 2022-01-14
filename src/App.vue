<template>
<NavBar :isLoggedIn="isLoggedIn" @logOut="logOut" />
<AuthModal v-if="!isLoggedIn" />
<PageList :token="token" :id="id" v-else />
<footer>&copy; 2021 Epic Cybernetics - built with <a href="https://vuejs.org" target="_blank">Vue.js</a></footer>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AuthModal from './components/AuthModal.vue';
import PageList from './components/PageList.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    AuthModal,
    PageList
  },
  data() {
    let isLoggedIn = window.localStorage.getItem("userToken") != undefined;
    let token, id;
    if (isLoggedIn) {
      token = window.localStorage.getItem("userToken");
      id = window.localStorage.getItem("userId");
    }
    return {
      isLoggedIn,
      token,
      id
    }
  },
  methods: {
    logOut() {
      window.localStorage.removeItem("userToken");
      window.localStorage.removeItem("userId");
      window.location.reload();
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

footer {
  position: absolute;
  padding: 1em;
  bottom: 0;
  left: 2.5vw;
  width: calc(100% - 2.5vw);
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 100px;
}

::-webkit-scrollbar-thumb {
  background-color: #ca0029;
  border-radius: 100px;
}
</style>
