const mongoose = require("mongoose");
const UserSchema = require("./user");
const PageSchema = require("./page");
const ReviewSchema = require("./review");
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

// PAGE FUNCTIONS
// Returns name of all pages for a single user
// Might not need this one
async function getAllPages(username) {
  const pageModel = getDbConnection().model("Page", PageSchema);
  const result = await pageModel.find({ owner: username });
  return result;
}

// Returns specific page of user
async function getFullPage(username, pageName) {
  const pageModel = getDbConnection().model("Page", PageSchema);
  const page = await pageModel.find({ owner: username, pageName: pageName });
  return page;
}

// Adds a page to the user if pageName doesn't already exist
async function addPage(page) {
  const pageModel = getDbConnection().model("Page", PageSchema);
  const pages = await getFullPage(page.owner, page.pageName);
  if (pages.length != 0) {
    console.log("Page with that name already");
    console.log(pages);
    return false;
  }
  try {
    console.log("adding page");
    const pageToAdd = new pageModel(page);
    const savedPage = await pageToAdd.save();
    return savedPage;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Gets everypage in the collection that is similar to the given pagename
async function pageQuery(pagename) {
  const pageModel = getDbConnection().model("Page", PageSchema);
  const pages = await pageModel.find({
    pageName: {
      $in: [
        new RegExp(pagename, "g"),
        new RegExp(pagename.toLowerCase(), "g"),
        new RegExp(pagename.toUpperCase(), "g"),
      ],
    },
  });
  return pages;
}

// Updates an already made page
async function updatePage(newPage, oldPageName) {
  page = await getFullPage(newPage.owner, oldPageName);
  if (page.length == 0) {
    console.log("No page with this name");
    return false;
  }
  oldPage = page[0];
  try {
    console.log("updating page");
    oldPage.overwrite(newPage);
    editedPage = await oldPage.save();
    return editedPage;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// REVIEW FUNCTIONS
async function getAllReviews(username) {
  const reviewModel = getDbConnection().model("Review", ReviewSchema);
  const reviews = reviewModel.find({ owner: username });
  return reviews;
}

async function getReview(username, reviewedObj) {
  const reviewModel = getDbConnection().model("Review", ReviewSchema);
  const review = reviewModel.find({
    owner: username,
    reviewedItem: reviewedObj,
  });
  return review;
}

async function addReview(newReview) {
  const reviewModel = getDbConnection().model("Review", ReviewSchema);
  // const reviewCheck = await getReview(newReview.owner, newReview.reviewedItem);
  // if (reviewCheck.length != 0) {
  //   console.log("Review already exists");
  //   console.log(reviewCheck);
  //   return false;
  // }
  try {
    const reviewToAdd = new reviewModel(newReview);
    const savedReview = await reviewToAdd.save();
    userList = await findUserByUserName(newReview.owner);
    // findUserByUserName(newReview.owner).then((userList) => {
    console.log("in call");
    user = userList[0];
    let revList = user.reviews;
    console.log(revList.array);
    // If empty Push review
    if (!revList || revList.length == 0) {
      revList = [];
      revList.push(newReview);
    }
    // Else check if review exists already
    else {
      revList.array.forEach((element) => {
        if (element.reviewedItem === newReview.reviewedItem) return false;
      });
      revList.push(newReview);
    }
    user.reviews = revList;
    result = await updateUser(user);
    // updateUser(user).then((result) => {
    console.log("done updating user");
    return true;
    // });
    // });
  } catch (error) {
    console.log("error caught" + error);
    return false;
  }
  console.log("outside func");
}

async function updateReview(updatedReview) {
  const reviewCheck = await getReview(
    updatedReview.owner,
    updatedReview.reviewedItem
  );
  if (reviewCheck.length == 0) {
    console.log("can't update review that doesnt exist");
    return false;
  }
  oldReview = reviewCheck[0];
  try {
    oldReview.overwrite(updatedReview);
    editedReview = await oldReview.save();
    return editedReview;
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports.setConnection = setConnection;
exports.findUserByUserName = findUserByUserName;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.getArtist = getArtist;
exports.getAlbum = getAlbum;
exports.getAllPages = getAllPages;
exports.getFullPage = getFullPage;
exports.addPage = addPage;
exports.updatePage = updatePage;
exports.pageQuery = pageQuery;
exports.addReview = addReview;
exports.getAllReviews = getAllReviews;
exports.getReview = getReview;
exports.updateReview = updateReview;
