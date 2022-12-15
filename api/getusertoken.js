/*
   /API/GETUSERTOKEN DOCUMENTATION
   ------------------------
   Generates a user's Facebook auth token
   Takes an OAuth redirect code and a redirect URL as URL parameters

*/
require("dotenv").config();
const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { code, redirect } = req.query;
  const FB_APP_ID = process.env.FB_APP_ID;
  const FB_APP_SECRET = process.env.FB_APP_SECRET;
  console.log("ID:" + FB_APP_ID, "\nSR:" + FB_APP_SECRET);
  let data = await fetch(
    `https://graph.facebook.com/v15.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${redirect}&client_secret=${FB_APP_SECRET}&code=${code}`
  );
  if (data.status) console.log(data);
  data = await data.json();
  let longToken = await fetch(
    `https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${data.access_token}`
  );
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
