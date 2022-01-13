<template>
  <div class="modal">
    <a @click="$emit('close')" class="button">Close</a>
    <h3>Post List</h3>
    <p>{{ page.name }}</p>
    <div class="table-container">
      <table>
        <tr>
          <th>Index</th>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "PostList",
  props: {
    page: Object,
    userToken: String
  },
  emits: ["close"],
  methods: {
    openPage(i) {
      this.list[i].selected = true;
    },
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    console.log(`PAGE: `, this.page.access_token)
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
        this.list = json.data;
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
  max-height: calc(90vh - 48px - 4.8em);
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 0.3em;
}

td:first-child {
  width: 1px;
}

a.button {
  float: right;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
