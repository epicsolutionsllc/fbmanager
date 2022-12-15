<template>
  <div class="auth">
    <h3>Log In</h3>
    <ContentLoader v-if="loading" />
    <a @click="logIn" class="button" v-else>Log In with Facebook</a>
  </div>
</template>

<script>
import ContentLoader from './ContentLoader.vue';
export default {
  name: "AuthModal",
  components: {
    ContentLoader
  },
  methods: {
    logIn() {
      let app = `https://${window.location.host}/`;
      let url = `https://www.facebook.com/v15.0/dialog/oauth?client_id=1790609924641634&redirect_uri=${encodeURI(
        app
      )}&scope=pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content`;
      window.location.replace(url);
    },
  },
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    let redirect = `https://${window.location.host}/`;
    let params = new URL(window.location.href);
    params = params.searchParams.get("code");
    if (params != undefined) {
      this.loading = true;
      fetch(`/api/getusertoken?code=${params}&redirect=${redirect}`)
        .then((result) => {
          if (result.status == 200) {
            return result.json();
          } else {
            alert("Whoops, try that again!");
            throw new Error("Got a non-200 response from API");
          }
        })
        .then((json) => {
          window.localStorage.setItem("userToken", json.access_token);
          window.localStorage.setItem("userId", json.user_id);
          window.location.replace(redirect);
          this.loading = false;
        });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auth {
  text-align: center;
  width: 50vw;
  max-width: 400px;
  margin: 3em auto;
  padding: 1.2em;
  border-radius: 5px;
  background: white;
  box-shadow: 0px 7px 20px 0 rgb(0 0 0 / 35%);
}
</style>
