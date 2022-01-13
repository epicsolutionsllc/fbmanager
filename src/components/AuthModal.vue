<template>
  <div class="auth">
    <h3>Log In</h3>
    <a @click="logIn" class="button">Log In with Facebook</a>
  </div>
</template>

<script>
export default {
  name: "AuthModal",
  methods: {
    logIn() {
      let app = `https://${window.location.host}/`;
      let url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=***REMOVED***&redirect_uri=${encodeURI(
        app
      )}&scope=pages_show_list,pages_read_engagement,pages_manage_posts,public_profile,pages_read_user_content`;
      window.location.replace(url);
    },
  },
  mounted() {
    let redirect = `https://${window.location.host}/`;
    let params = new URL(window.location.href);
    params = params.searchParams.get("code");
    if (params != undefined) {
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
