const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const dotenv = require("dotenv");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

dotenv.config();

const userServices = require("./models/user-services");
const testingpass = [];

app.use(cors());
app.use(express.json());

app.post("/testinglogin", async (req, res) => {
  const username = req.body.username;
  const pwd = req.body.pwd;
  const retrievedUser = fakeUser;
  if (retrievedUser.username && retrievedUser.pwd) {
    const isValid = await bcrypt.compare(pwd, retrievedUser.pwd);
    if (isValid) {
      // Generate token and respond
      const token = generateAccessToken(username);
      res.status(200).send(token);
    } else {
      //Unauthorized due to invalid pwd
      res.status(401).send("Unauthorized");
    }
  } else {
    //Unauthorized due to invalid username
    res.status(401).send("Unauthorized");
  }
}); 

app.post("/testingsignup", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const userPwd = req.body.pwd; 
  if (!username && !pwd && !email) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    if (username === fakeUser.username) {
      //Conflicting usernames. Assuming it's not allowed, then:
      res.status(409).send("Username already taken");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPWd = await bcrypt.hash(userPwd, salt);
    
      fakeUser.username = username;
      fakeUser.pwd = hashedPWd;
      
      const token = generateAccessToken(username);
      res.status(201).send(token);
    }
  }
});

app.get("/user/:user", async (req, res) => {
  const user_name = req.params["user"];
  const result = await userServices.findUserByUserName(user_name);
  if (result === undefined || result === null || result.length === 0) {
    console.log("Point reached");
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

app.get("/search/album/:album", async (req, res) => {
  const album_name = req.params["album"];
  const data = await userServices.getAlbum(album_name);
  if (data === undefined) {
    res.status(404).send(err);
  } else {
    res.send(data.body);
  }
});

app.get("/search/artist/:artist", async (req, res) => {
  const artist_name = req.params["artist"];
  const data = await userServices.getArtist(artist_name);
  if (data === undefined) {
    res.status(404).send(err);
  } else {
    res.send(data.body);
  }
});

app.post("/user", async (req, res) => {
  const user = req.body;
  const savedUser = await userServices.addUser(user);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

app.post("/reviews", async (req, res) => {
  const review = req.body;
  const success = await userServices.addReview(review);
  if (success) res.status(201).send(success);
  else res.status(500).end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
