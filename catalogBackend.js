const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

const userServices = require("./models/user-services");
const res = require("express/lib/response");
const req = require("express/lib/request");
const dbUser = { username: "", password: "" };

app.use(cors());
app.use(express.json());

/* Using this funcion as a "middleware" function for
  all the endpoints that need access control protecion */
function authenticateUser(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  //Getting the 2nd part of the auth hearder (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    return res.status(401).end();
  } else {
    // If a callback is supplied, verify() runs async
    // If a callback isn't supplied, verify() runs synchronously
    // verify() throws an error if the token is invalid
    try {
      // verify() returns the decoded obj which includes whatever objs
      // we use to code/sign the token
      console.log(token);
      console.log(process.env.TOKEN_SECRET);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      // in our case, we used the username to sign the token

      console.log("success in decoding");
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).end();
    }
  }
}

function generateAccessToken(username) {
  return jwt.sign({ username: username }, process.env.TOKEN_SECRET, {
    expiresIn: "60s",
  });
}

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("YES");
  const retrievedUserlist = await userServices.findUserByUserName(username);
  const retrievedUser = retrievedUserlist[0];

  if (retrievedUser && retrievedUser.username != undefined) {
    const isValid = await bcrypt.compare(password, retrievedUser.password);
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
    res.status(400).send("Bad user data");
  }
});

app.post("/signup", async (req, res) => {
  let newUser = req.body;
  const username = req.body.username;
  const email = req.body.email;
  const userPwd = req.body.password;
  user_search = await userServices.findUserByUserName(username);
  console.log(user_search);
  if (!username && !userPwd && !email) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    if (user_search.length > 0) {
      //Conflicting usernames. Assuming it's not allowed, then:
      res.status(409).send("Username already taken");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPWd = await bcrypt.hash(userPwd, salt);

      newUser.password = hashedPWd;

      console.log(newUser);

      const savedUser = await userServices.addUser(newUser);
      if (!savedUser) {
        //res.status(201).send(savedUser);
        res.status(500).end();
      }

      const token = generateAccessToken(username);
      res.status(201).send(token);
    }
  }
});

app.post("/page", async (req, res) => {
  let newPage = req.body;
  if (!newPage.owner || !newPage.pageName) {
    res.status(409).send("Bad Request");
  } else {
    pageSearch = await userServices.getFullPage(
      newPage.owner,
      newPage.pageName
    );
    if (pageSearch > 0) {
      res.status(409).send("Pagename already taken");
    } else {
      const savedPage = await userServices.addPage(newPage);
      if (!savedPage) {
        res.status(500).end();
      }

      const token = generateAccessToken(savedPage.owner);
      res.status(201).send(token);
    }
  }
});

app.patch("/patchprofile", async (req, res) => {
  let updatedUser = req.body;
  if (!updatedUser.username) {
    res.status(400).send("Bad Request: Invalid User");
  } else {
    user_search = await userServices.findUserByUserName(updatedUser.username);
    if (user_search.length < 1) {
      // Cannot update a user that does not exist
      res.status(409).send("User does not exist");
    } else {
      // User exist so let's update him
      const newUser = await userServices.updateUser(updatedUser);
      if (!newUser) {
        // update failed
        res.status(500).end();
      }

      const token = generateAccessToken(updatedUser.username);
      res.status(201).send(token);
    }
  }
});

app.patch("/patchpage", async (req, res) => {
  let updatedPage = req.body.newPage;
  console.log("Updating page" + req.body.updatedPage);
  if (!updatedPage.owner || !updatedPage.pageName) {
    console.log("bad");
    res.status(400).send("Bad Request");
  } else {
    pageSearch = await userServices.getFullPage(
      updatedPage.owner,
      updatedPage.pageName
    );
    console.log("Y");
    if (updatedPage.pageName === req.body.oldName || pageSearch < 1) {
      const newPage = await userServices.updatePage(
        updatedPage,
        req.body.oldName
      );
      console.log("Ye");
      if (!newPage) {
        res.status(500).end();
      }
      console.log("yes");
      const token = generateAccessToken(updatedPage.owner);
      res.status(201).send(token);
    } else {
      // Page with new name already exists
    }
  }
});

app.get("/search/:pagename", async (req, res) => {
  console.log("garsh");
  const page_name = req.params["pagename"];
  const result = await userServices.pageQuery(page_name);
  if (result === undefined || result === null) {
    console.log("Yes");
    res.status(404).send("Resource not found.");
  } else {
    res.status(200).send(result);
  }
});

app.get("/user/:user",
  authenticateUser, async (req, res) => {
    const user_name = req.params["user"];
    console.log("username");
    console.log(user_name);
    const result = await userServices.findUserByUserName(user_name);
    console.log(result[0]);
    if (result === undefined || result === null) {
      console.log("Point reached");
      res.status(404).send("Resource not found.");
    } else {
      res.status(200).send(result);
    }
  }
);

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

app.get("/pages/:user", async (req, res) => {
  const username = req.params["user"];
  const result = await userServices.getAllPages(username);
  console.log(result)
  if (result === undefined || result === null) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

app.post("/user", async (req, res) => {
  const user = req.body;
  //let imgBase64 = '';
  //let reader = new FileReader();
  //reader.readAsDataURL(user.profile);
  //user.profile = reader.result;
  const savedUser = await userServices.addUser(user);
  console.log(savedUser);
  if (savedUser) res.status(201).send(savedUser);
  else res.status(500).end();
});

app.post("/reviews", async (req, res) => {
  const review = req.body;
  userServices.addReview(review).then((success) => {
    console.log("done adding review" + success);
    if (success) res.status(201).send(success);
    else res.status(500).end();
  });
});

app.listen(process.env.PORT || port, () => {
  console.log("REST API is listening.");
});
