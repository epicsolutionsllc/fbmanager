<template>
  <AlertPopup
    v-if="showAlert"
    :choices="alertChoices"
    :description="alertDescription"
    @choice="choose($event)"
    :action="alertAction"
  />
  <div class="modal">
    <div class="top-buttons">
      <a
        @click="confirmAction('purge')"
        class="button button-outline"
        v-if="selected.length > 0"
        >Purge</a
      >
      <a
        @click="confirmAction('delete')"
        class="button button-outline"
        v-if="selected.length > 0"
        >Delete</a
      >
      <a @click="$emit('close')" class="button button-close">Close</a>
    </div>
    <h3>Post List</h3>
    <p>{{ page.name }}</p>
    <div class="table-container">
      <table>
        <tr>
          <th></th>
          <th>Title</th>
          <th>Date</th>
        </tr>
        <tr v-for="(post, i) in list" :key="post.id">
          <td>
            <input type="checkbox" @change="selectPost(i, $event)" />
          </td>
          <td>
            <div
              class="cell-content"
              :title="genTitle(post) + '\n\nClick to open in new tab'"
            >
              <a :href="`https://facebook.com/${post.id}`" target="_blank">{{
                genTitle(post)
              }}</a>
            </div>
          </td>
          <td>
            <div
              class="cell-content"
              :title="post.created_time"
              @click="copyId(post.id)"
            >
              {{ new Date(post.created_time).toLocaleDateString() }}
            </div>
          </td>
        </tr>
      </table>
      <ContentLoader v-if="loading" />
      <a
        @click="checkForMore"
        class="button button-outline load-more"
        v-if="!loading && areMore"
        >Load More</a
      >
    </div>
  </div>
  <div class="modal-shade" @click="$emit('close')"></div>
</template>

<script>
import ContentLoader from "./ContentLoader.vue";
import AlertPopup from "./AlertPopup.vue";
export default {
  name: "PostList",
  components: {
    ContentLoader,
    AlertPopup,
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
    genTitle(post) {
      const title = post.story || post.message;
      if (!title || title.length < 1) {
        return "[no title]";
      } else {
        return title;
      }
    },
    selectPost(i, e) {
      if (e.target.checked) {
        this.selected.push(i);
      } else {
        this.selected.pop(this.selected.indexOf(i));
      }
      console.log(this.selected);
    },
    confirmAction(a) {
      this.alertAction = a;
      if (a == "delete") {
        this.alertChoices = ["Cancel", "Confirm"];
        this.alertDescription =
          "This will fully delete all of the posts you have selected.";
        this.showAlert = true;
      } else if (a == "purge") {
        this.alertChoices = ["Go back", "Continue"];
        this.alertDescription =
          "This will delete ALL POSTS older than the most recent selected post.  Proceed with extreme caution.";
        this.showAlert = true;
      }
    },
    choose(c) {
      const a = c.action;
      c = c.val;
      this.showAlert = false;
      if (a == "delete" && c == 1) {
        this.deletePosts();
      } else if (a == "purge" && c == 1) {
        this.purge();
      } else if (a == "error" && c == 0) {
        window.open("mailto:micah.lindley@epicsolutions.com?subject=Error on FBManager&body=I encountered an error on FBManager: " + this.error)
      }
    },
    deletePosts() {
      this.selected.forEach((item) => {
        fetch(`/api/deletepost?token=${this.page.access_token}&post=${this.list[item].id}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.error) {
              this.error = data.error.code;
              this.alertAction = "error";
              this.alertChoices = ["Report", "Okay"];
              this.alertDescription = data.error.message;
            }
            this.showAlert = true;
          });
      });
    },
    purge() {
      alert("Purge code runs now.");
    },
    copyId(id) {
      navigator.clipboard.writeText(id);
    },
  },
  data() {
    return {
      list: [],
      selected: [],
      areMore: false,
      nextUrl: "",
      loading: true,
      confirmState: null,
      showAlert: false,
      alertChoices: [],
      alertDescription: "",
      alertAction: null,
      error: null
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
  text-align: left;
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
  z-index: 2;
}

.table-container {
  max-height: calc(84vh - 48px - 4.8em);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 0.3em;
  padding-bottom: 0.2em;
  width: calc(100% - 0.5em);
}

table {
  width: 100%;
}

input[type="checkbox"] {
  margin: 0;
}

h3 {
  line-height: 1;
  margin-bottom: 0.1em;
}

.top-buttons {
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
}

.top-buttons a {
  margin-left: 5px;
}

a:not(.button) {
  color: #ca0029;
}

.cell-content {
  width: 20vw;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.load-more {
  margin-left: 50%;
  transform: translateX(-50%);
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
