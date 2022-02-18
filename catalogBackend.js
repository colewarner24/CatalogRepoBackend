const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

var lastfm_data = {
  apiKey: "0be6331638837e7fea170d7a7ab72e63",
  apiSecret: "63f18939ea38fe857f20023a073b48f7",
  name: "cole24777",
};

const LastFM = require("last-fm");
const lastfm = new LastFM(lastfm_data.apiKey, {
  userAgent: "MyApp/1.0.0 (http://example.com)",
});

app.get("/:user", (req, res) => {
  const user_name = req.params["user"];
  try {
    const result = await userServices.findUserByUserName(user_name);
    res.send({ users_list: result });
  } catch (error) {
    console.log(error);
    res.status(500).send("User does not exist.");
  }
});

// app.get('/users', (req, res) => {
//     const name = req.query.name;
//     const job = req.query.job;
//     if ((name != undefined) && (job != undefined)){
//         let result = findUserByNameandJob(name, job);
//         result = {users_list: result};
//         res.send(result);
//     }
//     else if (name != undefined){
//         let result = findUserByName(name);
//         result = {users_list: result};
//         res.send(result);
//     }
//     else{
//         res.send(users);
//     }
// });

app.get("/search/album/:album", (req, res) => {
  const album_name = req.params["album"]; //or req.params.id
  lastfm.albumSearch({ q: album_name, limit: 1 }, (err, data) => {
    if (err) res.status(404).send(err);
    else res.send(data);
  });
});

app.get("/search/artist/:artist", (req, res) => {
  const artist_name = req.params["artist"]; //or req.params.id
  lastfm.artistSearch({ q: artist_name, limit: 1 }, (err, data) => {
    if (err) res.status(404).send(err);
    else res.send(data);
  });
});

app.post("/users", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
