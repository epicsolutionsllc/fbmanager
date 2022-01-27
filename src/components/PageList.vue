<template>
  <transition name="slide">
    <PostList
      v-if="postSelected != null"
      :page="list[postSelected]"
      :userToken="token"
      @close="closePost"
    />
  </transition>
  <transition name="fade">
    <div
      class="modal-shade"
      v-if="postSelected != null"
    ></div>
  </transition>
  <main>
    <h3>Page List</h3>
    <p>only pages that you have granted access to will appear</p>
    <div class="table-container">
      <table>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Identifier</th>
        </tr>
        <tr v-for="(page, i) in list" :key="page.id">
          <td>
            <a
              @click="openPost(i)"
              class="button button-outline button-icon"
              title="Edit posts on this page"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="2" x2="22" y2="6"></line>
                <path d="M7.5 20.5L19 9l-4-4L3.5 16.5 2 22z"></path></svg
            ></a>
          </td>
          <td>{{ page.name }}</td>
          <td>{{ page.id }}</td>
        </tr>
      </table>
    </div>
    <ContentLoader v-if="loading" />
  </main>
</template>

<script>
import PostList from "./PostList.vue";
import ContentLoader from "./ContentLoader.vue";
export default {
  name: "PageList",
  components: {
    PostList,
    ContentLoader,
  },
  props: {
    token: String,
    id: String,
  },
  methods: {
    openPost(i) {
      this.postSelected = i;
    },
    closePost() {
      console.log('Closing post')
      this.postSelected = null;
    },
  },
  data() {
    return {
      list: [],
      postSelected: null,
      loading: true,
    };
  },
  mounted() {
    fetch(`/api/getvalidpages?token=${this.token}&id=${this.id}`)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          alert("This page has no posts.");
          return {};
        }
      })
      .then((json) => {
        this.list = json.data;
        this.loading = false;
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
main {
  text-align: center;
  width: 95vw;
  height: calc(90vh - 48px);
  margin: auto;
  margin-top: 2.5vh;
  padding: 1.2em;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
}

.table-container {
  max-height: calc(90vh - 48px - 6.5em);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 0.3em;
}

td:first-child {
  width: 1px;
}

a.button {
  margin: 0.2rem 0;
}

h3 {
  line-height: 1;
  margin-bottom: 0.1em;
}

.slide-enter-active {
  transition: all 0.2s ease-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in;
}

.slide-enter-from,
.slide-leave-to {
  transform: translate(-50%, 150%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-shade {
  height: calc(100vh - 48px);
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  position: absolute;
  top: 48px;
  left: 0;
  z-index: 1;
}
</style>
