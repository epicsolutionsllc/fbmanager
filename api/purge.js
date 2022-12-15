const fetch = require("node-fetch");
export default async function handler(req, res) {
  const { token } = req.query;
  console.log("Got a purge request.", token);
  const purge = async (postList, nextUrl, skipTo) => {
    if (!skipTo) {
      skipTo = 0;
    }
    postList.forEach(async (post, i) => {
      if (i < skipTo) {
        return;
      }
      let deleted = await fetch(
        `https://graph.facebook.com/v12.0/${post.id}?access_token=${token}`,
        {
          method: "DELETE",
        }
      );
      if (deleted.status != 200) {
        deleted = await deleted.json();
        if (
          deleted.error.message !=
            "(#200) This post wasn't created by the application" &&
          deleted.error.message != "(#200) Permissions error" &&
          !deleted.error.message.contains("Unsupported delete request")
        ) {
          res.status(403).send(deleted);
        } else {
          console.log("Post not created by app.");
        }
      } else {
        console.log("Deleted post", post.message || post.story);
      }
      if (i == list.length - 1) {
        console.log("Finished a page");
        if (!nextUrl) {
          res.status(200).send(200);
        }
        console.log("Fetching new page:", nextUrl);
        list = await fetch(nextUrl);
        let json = await list.json();
        setTimeout(() => {
          console.log("Starting new page");
          purge(json.data, json.paging.next);
        }, 1000);
      }
    });
  };
  let { list, initial, nextPage } = JSON.parse(req.body);
  console.log(initial.id);
  let firstIndex = list.findIndex((element) => {
    return element.id == initial.id;
  });
  console.log(`Will start deleting posts at index ${firstIndex}.`);
  if (firstIndex == -1) {
    res.status(401).send(401);
  }
  purge(list, nextPage, 6);
  /*
  let deleted = await fetch(
    `https://graph.facebook.com/v15.0/${post}?access_token=${token}`,
    {
      method: "DELETE"
    }
  );
  deleted = await deleted.json();
  */
}
