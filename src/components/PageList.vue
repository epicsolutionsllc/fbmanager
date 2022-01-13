<template>
  <PostList v-if="postSelected != null" :page="list[postSelected]" :userToken="token" @close="closePost" />
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
            <a @click="openPost(i)" class="button button-outline">Edit</a>
          </td>
          <td>{{ page.name }}</td>
          <td>{{ page.id }}</td>
        </tr>
      </table>
    </div>
  </main>
</template>

<script>
import PostList from './PostList.vue';
export default {
  name: "PageList",
  components: {
    PostList
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
      this.postSelected = null;
    }
  },
  data() {
    return {
      list: [],
      postSelected: null
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
</style>
