<template>
  <div class="post-list-wrapper">
    <AlertPopup v-if="showAlert" :choices="alertChoices" :description="alertDescription" @choice="choose($event)"
      :action="alertAction" />
    <div class="modal">
      <div class="top-buttons">
        <a @click="confirmAction('delete')" class="button button-outline button-icon" v-if="selected.length > 0"
          title="Delete all selected posts"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg></a>
        <a @click="confirmAction('purge')" class="button button-outline button-icon" v-if="selected.length > 0"
          title="Purge as many old posts as possible"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M11 12H3"></path>
            <path d="M16 6H3"></path>
            <path d="M16 18H3"></path>
            <path d="M19 10l-4 4"></path>
            <path d="M15 10l4 4"></path>
          </svg></a>
        <a @click="refreshPosts" class="button button-outline button-icon" title="Refresh post list">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6"></path>
            <path d="M21 12A9 9 0 006 5.3L3 8"></path>
            <path d="M21 22v-6h-6"></path>
            <path d="M3 12a9 9 0 0015 6.7l3-2.7"></path>
          </svg>
        </a>
        <a @click="$emit('close')" class="button button-close">Close</a>
      </div>
      <h3>Post List</h3>
      <p>{{ page.name }}</p>
      <div class="table-container">
        <table>
          <tr>
            <th>
              <input type="checkbox" @change="selectAll($event)" />
            </th>
            <th>Title</th>
            <th>Date</th>
          </tr>
          <tr v-for="(post, i) in list" :key="post.id" :data-key="i" :class="selected.includes(i) ? 'selected' : ''">
            <td>
              <input type="checkbox" @change="selectPost(i, $event)" :checked="selected.includes(i)" />
            </td>
            <td>
              <div class="cell-content" :title="genTitle(post) + '\n\nClick to open in new tab'">
                <a :href="`https://facebook.com/${post.id}`" target="_blank">{{
                    genTitle(post)
                }}</a>
              </div>
            </td>
            <td>
              <div class="cell-content" :title="post.created_time" @click="copyId(post.id)">
                {{ new Date(post.created_time).toLocaleDateString() }}
              </div>
            </td>
          </tr>
        </table>
        <ContentLoader v-if="loading" />
        <a @click="checkForMore" class="button button-outline load-more" v-if="!loading && areMore">Load More</a>
      </div>
    </div>
  </div>
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
    refreshPosts() {
      this.list = [];
      this.selected = [];
      this.loading = true;
      fetch(
        `/api/getposts?token=${this.page.access_token}&page=${this.page.id}`
      )
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
        this.selected.splice(this.selected.indexOf(i), 1);
      }
      console.log(this.selected);
    },
    selectAll(e) {
      if (e.target.checked) {
        this.list.forEach((item, i) => {
          this.selected.push(i);
        });
      } else {
        this.selected = [];
      }
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
          "<b>Proceed with extreme caution.</b>  This will delete as many posts as possible older than the most recent selected post.";
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
        window.open(
          "mailto:micah.lindley@epicsolutions.com?subject=Error on FBManager&body=I encountered an error on FBManager: " +
          this.error
        );
      }
    },
    deletePosts() {
      this.selected.forEach((index) => {
        let listItem = this.list[index];
        fetch(
          `/api/deletepost?token=${this.page.access_token}&post=${listItem.id}`
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.error) {
              this.error = data.error.code;
              this.alertAction = "error";
              this.alertChoices = ["Report", "Okay"];
              if (data.error.message.includes("created by the application")) {
                data.error.message +=
                  '.  See <a href="https://stackoverflow.com/a/12885762/10806546" target="_blank" class="inline-link">this page</a> for more information.';
              }
              this.alertDescription =
                data.error.type + ": " + data.error.message;
              this.showAlert = true;
            } else if (data.success == true) {
              this.list.splice(this.list.indexOf(listItem), 1);
              this.selected.shift();
            }
          });
      });
    },
    purge() {
      console.log(this.list.length, "list length");
      this.loading = true;
      let first = Math.min(...this.selected);
      fetch(`/api/purge?token=${this.page.access_token}`, {
        method: "POST",
        body: JSON.stringify({
          list: this.list,
          initial: this.list[first],
          nextPage: this.nextUrl,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            this.error = data.error.code;
            this.alertAction = "error";
            this.alertChoices = ["Report", "Okay"];
            this.alertDescription = data.error.type + ": " + data.error.message;
            this.showAlert = true;
          }
        });
      this.list = [];
      this.selected = [];
      setTimeout(this.refreshPosts, 8500);
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
      showAlert: false,
      alertChoices: [],
      alertDescription: "",
      alertAction: null,
      error: null,
    };
  },
  mounted() {
    console.log(`PAGE: `, this.page.access_token);
    this.refreshPosts();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-list-wrapper {
  position: absolute;
  top: calc(50% + 24px);
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  width: 100vw;
  height: calc(100vh - 48px);
  background: transparent;
}

.modal {
  position: relative;
  text-align: left;
  width: 55vw;
  height: calc(90vh - 48px);
  margin: auto;
  padding: 1.2em;
  border-radius: 5px;
  background: var(--bg-1);
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
  top: 50%;
  transform: translateY(-50%);
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
  color: var(--accent);
}

.cell-content {
  width: 20vw;
  var(--bg-1)-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.load-more {
  margin-left: 50%;
  transform: translateX(-50%);
}

input[type="checkbox"] {
  margin-left: 10px;
}

.selected {
  background: rgb(255, 195, 195);
}
</style>
