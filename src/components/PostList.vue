<template>
  <div class="modal">
    <a @click="$emit('close')" class="button button-close">Close</a>
    <h3>Post List</h3>
    <p>{{ page.name }}</p>
    <div class="table-container">
      <table>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Identifier</th>
        </tr>
        <tr v-for="page in list" :key="page.id">
          <td>
            <input type="checkbox" />
          </td>
          <td>{{ page.story || page.message }}</td>
          <td>{{ page.id }}</td>
        </tr>
      </table>
      <ContentLoader v-if="loading" />
      <a @click="checkForMore" class="button button-outline" v-if="!loading && areMore">Load More</a>
    </div>
  </div>
</template>

<script>
import ContentLoader from "./ContentLoader.vue";
export default {
  name: "PostList",
  components: {
    ContentLoader,
  },
  props: {
    page: Object,
  },
  emits: ["close"],
  methods: {
    openPage(i) {
      this.list[i].selected = true;
    },
    checkForMore() {
      this.loading = true;
      if (this.areMore == true) {
        fetch(this.nextUrl)
          .then((response) => {
            if (response.status == 200) {
              return response.json();
            } else {
              alert("You don't have any pages connected to your account.");
              return {};
            }
          })
          .then((json) => {
            console.log(json);
            json.data.forEach((item) => {
              this.list.push(item);
            });
            if (json.paging.next) {
              this.areMore = true;
              this.nextUrl = json.paging.next;
            }
            this.loading = false;
          });
      }
    },
  },
  data() {
    return {
      list: [],
      areMore: false,
      nextUrl: "",
      loading: true
    };
  },
  mounted() {
    console.log(`PAGE: `, this.page.access_token);
    fetch(`/api/getposts?token=${this.page.access_token}&page=${this.page.id}`)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          alert("You don't have any pages connected to your account.");
          return {};
        }
      })
      .then((json) => {
        console.log(json);
        this.list = json.data;
        if (json.paging.next) {
          this.areMore = true;
          this.nextUrl = json.paging.next;
        }
        this.loading = false;
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal {
  position: relative;
  text-align: center;
  width: 55vw;
  height: calc(90vh - 48px);
  margin: auto;
  margin-top: 2.5vh;
  padding: 1.2em;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.table-container {
  max-height: calc(84vh - 48px - 4.8em);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 0.3em;
  padding-bottom: 0.2em;
}

td:first-child {
  width: 1px;
}

h3 {
  line-height: 1;
  margin-bottom: 0.1em;
}

a.button-close {
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
