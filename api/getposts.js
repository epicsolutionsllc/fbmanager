/*
   /API/GETPOSTS DOCUMENTATION
   ------------------------
   Gets posts from a page
   Takes a token and a page ID as URL parameters

*/
const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { token, page } = req.query;
  let posts = await fetch(
    `https://graph.facebook.com/v15.0/${page}/feed?access_token=${token}`
  );
  posts = await posts.json();
  if (posts.length < 1) {
    res.status(301);
  } else {
    res.status(200).send(posts);
  }
}
