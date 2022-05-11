const mongoose = require("mongoose");
const UserSchema = require("./user");
const dotenv = require("dotenv");
dotenv.config();

let dbConnection;

var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    //console.log("The access token expires in " + data.body["expires_in"]);
    //console.log("The access token is " + data.body["access_token"]);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

function setConnection(newConn) {
  dbConnection = newConn;
  return dbConnection;
}

function getDbConnection() {
  if (!dbConnection) {
    dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

async function findUserByUserName(username) {
  const userModel = getDbConnection().model("User", UserSchema);
  const result = await userModel.find({ username: username });
  return result;
}

async function addUser(user) {
  const userModel = getDbConnection().model("User", UserSchema);
  console.log(user.username);
  const userCheck = await findUserByUserName(user.username);
  if (userCheck.length != 0) {
    console.log("Already a user with username:", user.username);
    return false;
  }
  try {
    console.log("adding user");
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateUser(newUser) {
  // const userModel = getDbConnection().model("User", UserSchema);
  const userCheck = await findUserByUserName(newUser.username);
  if (userCheck.length == 0) {
    console.log("No user with username: ", newUser.username);
    return false;
  }
  oldUser = userCheck[0];
  try {
    console.log("updating user");
    oldUser.overwrite(newUser);
    editedUser = await oldUser.save();
    return editedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getAlbum(album_name) {
  return spotifyApi.searchAlbums(`album:${album_name}`);
}

async function getArtist(artist_name) {
  return spotifyApi.searchArtists(`artist:${artist_name}`);
}

async function addReview(review) {
  const userModel = getDbConnection().model("User", UserSchema);
  const username = review.username;
  if ((await findUserByUserName(username)).length != 0) {
    await userModel.updateOne(
      { username: username },
      { $push: { reviews: review } }
    );
    return true;
  } else return false;
}

exports.addUser = addUser;
exports.findUserByUserName = findUserByUserName;
exports.addReview = addReview;
exports.getAlbum = getAlbum;
exports.getArtist = getArtist;
exports.setConnection = setConnection;
exports.updateUser = updateUser;
