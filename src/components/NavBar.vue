<template>
  <div class="navbar">
    <img src="../assets/epic.svg">
    <div class="activity-parent">
      <transition name="fade">
        <div v-if="activity">
          <p class="activity-name">{{ activity.name }}</p>
          <div class="progress-bar">
            <span :style="`width: ${(activity.finished / activity.total) * 100}%;`"></span>
          </div>
        </div>
      </transition>
    </div>
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
    },
    activity: {
      total: Number,
      finished: Number,
      name: String
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
  background: var(--bg-1);
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
  height: 48px;
  display: flex;
}

img {
  height: 45px;
  padding: 7px 20px;
  padding-left: 0;
  padding-right: 0;
  margin-left: 2.5vw;
}

h4 {
  margin-top: 0.9rem;
  margin-right: 2.5vw;
}

a.button {
  float: right;
  margin: 5px;
  margin-right: 2.5vw;
}

.activity-parent {
  flex-grow: 1;
  padding: 0 2em;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.activity-name {
  font-size: 1.2rem;
  margin: 0;
  margin-bottom: 0.5rem;
  width: 100%;
}

.progress-bar {
  height: 7px;
  width: 100%;
  background-color: #ddd;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
}

.progress-bar:after {
  content: '';
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0));
  display: block;
  height: 7px;
  width: 10%;
  position: absolute;
  top: 0;
  animation: progress 3s infinite cubic-bezier(.17, .67, .84, .36);
}

.progress-bar span {
  background-color: var(--accent);
  display: block;
  height: 100%;
  transition: width 0.2s ease;
}

@keyframes progress {
  0% {
    left: -10%;
  }

  100% {
    left: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
