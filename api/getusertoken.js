const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { code, redirect } = req.query;
  const APP_ID = "317535696937100";
  const APP_SECRET = "03f3f6a0f24c6c6de12e3bf11c3f7407";
  let data = await fetch(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${redirect}&client_secret=${APP_SECRET}&code=${code}`
  );
  data = await data.json();
  let longToken = await fetch(
    `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${data.access_token}`
  ); // request a new token based on argv[2]
  longToken = await longToken.json();
  if (longToken.access_token) {
    let user = await fetch(
      `https://graph.facebook.com/me?fields=id&access_token=${longToken.access_token}`
    );
    user = await user.json();
    longToken.user_id = user.id;
    res.status(200).send(longToken);
  } else {
    res.status(401);
  }
}
