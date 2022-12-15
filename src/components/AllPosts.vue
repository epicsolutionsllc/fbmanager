<template>
  <transition name="slide">
    <PostList v-if="pageSelected != null" :page="pageSelected" :userToken="token" @close="closePage" />
  </transition>
  <transition name="fade">
    <div class="modal-shade" v-if="pageSelected != null"></div>
  </transition>
  <main>
    <AlertPopup v-if="showAlert" :choices="alertChoices" :description="alertDescription" @choice="choose($event)"
      :action="alertAction" :contained="true" />
    <h3>All Posts</h3>
    <p>this is a syndicated list of all posts from all of your pages</p>
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
      <!-- <a @click="confirmAction('purge')" class="button button-outline button-icon" v-if="selected.length > 0"
        title="Purge as many old posts as possible"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M11 12H3"></path>
          <path d="M16 6H3"></path>
          <path d="M16 18H3"></path>
          <path d="M19 10l-4 4"></path>
          <path d="M15 10l4 4"></path>
        </svg></a> -->
      <a @click="refreshPosts" class="button button-outline button-icon" title="Refresh post list">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 2v6h6"></path>
          <path d="M21 12A9 9 0 006 5.3L3 8"></path>
          <path d="M21 22v-6h-6"></path>
          <path d="M3 12a9 9 0 0015 6.7l3-2.7"></path>
        </svg>
      </a>
    </div>
    <div class="table-container" v-if="!loading">
      <table>
        <tr>
          <th>
            <input type="checkbox" @change="selectAll($event)" />
          </th>
          <th>Title</th>
          <th>Date</th>
        </tr>
        <tr v-for="(post, i) in syndicatedPosts" :key="post.id" :data-key="i"
          :class="selected.includes(i) ? 'selected' : ''">
          <td>
            <input type="checkbox" @change="selectPost(i, $event)" :checked="selected.includes(i)" />
          </td>
          <td>
            <div class="cell-content">
              <a :href="`https://facebook.com/${post.id}`" target="_blank"
                :title="genTitle(post) + '\n\nClick to open in new tab'">{{
                    genTitle(post)
                }}</a>
              <a class="page-name" href="#" role="button" @click.prevent="openPage(post.page)"
                title="Show only this page's posts"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
                  viewBox="0 0 24 24" class="eva eva-briefcase-outline" fill="inherit">
                  <g data-name="Layer 2">
                    <g data-name="briefcase">
                      <rect width="24" height="24" opacity="0"></rect>
                      <path
                        d="M19 7h-3V5.5A2.5 2.5 0 0 0 13.5 3h-3A2.5 2.5 0 0 0 8 5.5V7H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3zm-4 2v10H9V9zm-5-3.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V7h-4zM4 18v-8a1 1 0 0 1 1-1h2v10H5a1 1 0 0 1-1-1zm16 0a1 1 0 0 1-1 1h-2V9h2a1 1 0 0 1 1 1z">
                      </path>
                    </g>
                  </g>
                </svg>{{ post.page }}</a>
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
    <ContentLoader v-if="loading" />
  </main>
</template>

<script>
import PostList from "./PostList.vue";
import ContentLoader from "./ContentLoader.vue";
import AlertPopup from "./AlertPopup.vue";
export default {
  name: "PageList",
  components: {
    PostList,
    ContentLoader,
    AlertPopup
  },
  emits: ["activity", "progress"],
  props: {
    token: String,
    id: String,
  },
  methods: {
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
        this.syndicatedPosts.forEach((item, i) => {
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
      this.$emit("activity", {
        total: this.selected.length, finished: 0, name: `Deleting ${this.selected.length} posts...`
      });
      this.selected.forEach((index) => {
        let listItem = this.syndicatedPosts[index];
        fetch(
          `/api/deletepost?token=${this.pages[listItem.pageIndex].access_token}&post=${listItem.id}`
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            this.$emit("progress");
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
              this.syndicatedPosts.splice(this.syndicatedPosts.indexOf(listItem), 1);
              this.selected.shift();
            }
          });
      });
    },
    purge() {
      console.log(this.syndicatedPosts.length, "list length");
      this.loading = true;
      let first = Math.min(...this.selected);
      fetch(`/api/purge?token=${this.page.access_token}`, {
        method: "POST",
        body: JSON.stringify({
          list: this.syndicatedPosts,
          initial: this.syndicatedPosts[first],
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
      this.syndicatedPosts = [];
      this.selected = [];
      setTimeout(this.refreshPosts, 8500);
    },
    openPage(name) {
      console.log(this.pages)
      this.pageSelected = this.pages.find((obj) => obj.name == name);
      console.log(this.pageSelected);
    },
    closePage() {
      console.log("Closing post");
      this.pageSelected = null;
    },
    refreshPosts() {
      this.loading = true;
      this.syndicatedPosts = [];
      this.selected = [];
      fetch(`/api/getpages?token=${this.token}&id=${this.id}`)
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            return {};
          }
        })
        .then((json) => {
          this.pages = json.data;
          this.$emit("activity", {
            total: json.data.length, finished: 0, name: `Fetching posts from ${json.data.length} pages...`
          })
          this.pages.forEach((page, index) => {
            fetch(
              `/api/getposts?token=${page.access_token}&page=${page.id}`
            )
              .then((response) => {
                if (response.status == 200) {
                  return response.json();
                } else {
                  alert(`Recieved an error code: ${response.status}`);
                  return {};
                }
              })
              .then((json) => {
                this.$emit("progress");
                json.data.forEach((post) => {
                  post.page = page.name;
                  post.pageIndex = index;
                })
                if (index == this.pages.length - 1) {
                  this.loading = false;
                }
                this.syndicatedPosts = [...this.syndicatedPosts, ...json.data]
                if (json.paging.next) {
                  this.areMore = true;
                  this.nextUrls.push(json.paging.next);
                }

                this.syndicatedPosts.sort(function (a, b) {
                  return new Date(b.created_time) - new Date(a.created_time);
                });
              });

          })

        });
    }
  },
  data() {
    return {
      syndicatedPosts: [],
      pages: [],
      selected: [],
      loading: true,
      areMore: false,
      nextUrls: [],
      pageSelected: null,
      showAlert: false,
      alertChoices: [],
      alertDescription: "",
      alertAction: null,
      error: null,
    };
  },
  mounted() {
    this.refreshPosts();
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
  margin-top: 0;
  padding: 1.2em;
  border-radius: 5px;
  background: var(--bg-1);
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
  transform: translateY(-1rem);
}

.top-buttons {
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
}

.top-buttons a {
  margin-left: 5px !important;
}

.table-container {
  max-height: calc(100% - 7rem);
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

a:not(.button) {
  color: var(--accent);
}

h3 {
  line-height: 1;
  margin-bottom: 0.1em;
}

.page-name {
  margin: 0;
  display: flex;
  align-items: center;
  color: rgba(106, 12, 31, 0.5) !important;
  fill: rgba(106, 12, 31, 0.5);
  font-size: 1.3rem;
  cursor: pointer;
}

.page-name svg {
  height: 1em;
  width: 1em;
  margin-right: 0.3em;
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
