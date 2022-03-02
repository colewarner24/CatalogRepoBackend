const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");

const userServices = require("./models/user-services");

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

app.get("/:user", async (req, res) => {
  const user_name = req.params["user"];
  const result = await userServices.findUserByUserName(user_name);
  if (result === undefined || result === null || result.length === 0) {
    console.log("Point reached");
    res.status(404).send("Resource not found."); }
  else {
    res.status(200).send(result);
  }});

app.get("/search/album/:album", (req, res) => {
  const album_name = req.params["album"];
  lastfm.albumSearch({ q: album_name, limit: 1 }, (err, data) => {
    if (err) res.status(404).send(err);
    else res.send(data);
  });
});

app.get("/search/artist/:artist", (req, res) => {
  const artist_name = req.params["artist"];
  lastfm.artistSearch({ q: artist_name, limit: 1 }, (err, data) => {
    if (err) res.status(404).send(err);
    else res.send(data);
  });
});

app.post("/user", async (req, res) => {
  const user = req.body;
  //   const user_name = user["username"];
  //   const find_user = await userServices.findUserByUserName(user_name);
  //   if (find_user === undefined || find_user === null) {
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
  //   } else res.status(500).end();
});

app.post("/reviews", async (req, res) => {
  const review = req.body;
  //   const user_name = user["username"];
  //   const find_user = await userServices.findUserByUserName(user_name);
  //   if (find_user === undefined || find_user === null) {
  const success = await userServices.addReview(review);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
  //   } else res.status(500).end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
