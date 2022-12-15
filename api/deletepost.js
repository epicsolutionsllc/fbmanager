const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { token, post } = req.query;
  let deleted = await fetch(
    `https://graph.facebook.com/v15.0/${post}?access_token=${token}`,
    {
      method: "DELETE",
    }
  );
  deleted = await deleted.json();
  res.status(200).send(deleted);
}
