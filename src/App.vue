<template>
  <NavBar :isLoggedIn="isLoggedIn" @logOut="logOut" :activity="{ ...currentActivity, finished: activityProgress }" />
  <AuthModal v-if="!isLoggedIn" />
  <div v-else>
    <div class="tabs">
      <button :class="{ tab: true, activeTab: tab == 0 }" @click="tab = 0">Pages</button>
      <button :class="{ tab: true, activeTab: tab == 1 }" @click="tab = 1">Posts</button>
    </div>
    <PageList :token="token" :id="id" v-if="tab == 0" />
    <AllPosts :token="token" :id="id" v-if="tab == 1" @activity="setActivity" @progress="progress" />
  </div>
  <footer>&copy; {{ new Date().getFullYear() }} Epic Cybernetics - built with <a href="https://vuejs.org"
      target="_blank">Vue.js</a></footer>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AuthModal from './components/AuthModal.vue';
import PageList from './components/PageList.vue';
import AllPosts from './components/AllPosts.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    AuthModal,
    PageList,
    AllPosts
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
      id,
      tab: 0,
      currentActivity: null,
      activityProgress: null
    }
  },
  methods: {
    logOut() {
      window.localStorage.removeItem("userToken");
      window.localStorage.removeItem("userId");
      window.location.reload();
    },
    setActivity(activity) {
      this.currentActivity = activity;
      if (this.currentActivity.finished) {
        this.activityProgress = this.currentActivity.finished;
      }
    },
    progress() {
      this.activityProgress++;
      if (this.activityProgress >= this.currentActivity.total) {
        setTimeout(() => {
          this.currentActivity = null;
          this.activityProgress = null;
        }, 500)
      }
    }
  }
}
</script>

<style>
:root {
  --accent: #ca0029;
  --bg-1: #fff;
  --text-1: #222;
}

body {
  background-color: var(--bg-1);
  color: var(--text-1) !important;
}

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
  background-color: var(--accent);
  border-radius: 100px;
}

footer a {
  color: var(--accent);
}

body {
  overflow: hidden;
}

.inline-link {
  color: var(--accent);
}

.tabs {
  margin-left: 2.5vw;
  margin-top: 1.5vh;
}

input[type="checkbox"] {
  accent-color: var(--accent);
}

.tab {
  margin-bottom: 0;
  padding-bottom: 1rem;
  height: auto;
  margin-right: 0.5rem;
  background: var(--bg-1) !important;
  color: var(--accent);
}

.tab:hover {
  color: initial;
}

.activeTab {
  background-color: var(--accent) !important;
  color: var(--bg-1) !important;
}

.tab:focus {
  color: var(--accent);
}
</style>
