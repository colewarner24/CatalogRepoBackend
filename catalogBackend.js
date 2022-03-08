const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userServices = require("./models/user-services");

var SpotifyWebApi = require('spotify-web-api-node');

app.use(cors());
app.use(express.json());

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

app.get("/user/:user", async (req, res) => {
  const user_name = req.params["user"];
  const result = await userServices.findUserByUserName(user_name);
  if (result === undefined || result === null || result.length === 0) {
    console.log("Point reached");
    res.status(404).send("Resource not found."); }
  else {
    res.status(200).send(result);
  }});

  app.get("/search/album/:album", async (req, res) => {
    const album_name = req.params["album"];
    spotifyApi.searchAlbums(`album:${album_name}`).then(
      function(data) {
        res.send(data.body)
      },
      function(err) {
        res.status(404).send(err)
      }
    );
  });
  
  
  app.get("/search/artist/:artist", (req, res) => {
    const artist_name = req.params["artist"];
    spotifyApi.searchArtists(`artist:${artist_name}`).then(
      function(data) {
        res.send(data.body)
      },
      function(err) {
        res.status(404).send(err)
      }
    );
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
