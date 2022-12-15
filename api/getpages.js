/*
   /API/GETPAGES DOCUMENTATION
   ------------------------
   Gets the first 100 pages (max) that the app has access to
   Takes a token and user ID as URL parameters

*/
const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { token, id } = req.query;
  let fbUserPages = await fetch(
    `https://graph.facebook.com/${id}/accounts?fields=name,access_token&access_token=${token}&limit=100`
  );
  fbUserPages = await fbUserPages.json();
  if (fbUserPages.data.length < 1) {
    res.status(301);
  }
  res.status(200).send(fbUserPages);
}
