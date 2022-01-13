const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { token, page } = req.query;
  let posts = await fetch(
    `https://graph.facebook.com/${page}/feed?access_token=${token}
    }`
  );
  posts = await posts.json();
  console.log(JSON.stringify(posts))
  if (posts.length < 1) {
    res.status(301);
  } else {
    res.status(200).send(posts);
  }
}
