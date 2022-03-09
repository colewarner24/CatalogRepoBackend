const mongoose = require("mongoose");
const UserSchema = require("./user");
const userServices = require("./user-services");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let conn;
let userModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  userModel = conn.model("User", UserSchema);

  userServices.setConnection(conn);
});

test("Searching up an album on Spotify API", async () => {
  const albumName = "Blonde";
  const album = await userServices.getAlbum(albumName);
  expect(album).toBeDefined();
  expect(album.body.albums.items[0].name).toBe(albumName);
});

test("Searching up an album on Spotify API 2", async () => {
  const albumName = "Back In Black";
  const album = await userServices.getAlbum(albumName);
  expect(album).toBeDefined();
  expect(album.body.albums.items[0].name).toBe(albumName);
});

test("Searching up an artist on Spotify API", async () => {
  const artistName = "Garth Brooks";
  const artist = await userServices.getArtist(artistName);
  expect(artist).toBeDefined();
  expect(artist.body.artists.items[0].name).toBe(artistName);
});

test("Searching up an artist on Spotify API 2", async () => {
  const artistName = "Frank Ocean";
  const artist = await userServices.getArtist(artistName);
  expect(artist).toBeDefined();
  expect(artist.body.artists.items[0].name).toBe(artistName);
});

test("Adding a user and then getting a user", async () => {
  const user = {
    username: "Nickisadog",
    bio: "here is my bio",
    profile_pic_url: "dasgg",
    albums: ["Album1", "Album2", "Album3"],
    artists: ["Artist 1", "Artist 2"],
    reviews: [],
  };

  const saved_user = await userServices.addUser(user);
  expect(saved_user.username).toBe(user.username);

  const getuser = await userServices.findUserByUserName(user.username);
  expect(getuser).toBeDefined();
  expect(getuser[0]["username"]).toBe(user.username);
  expect(getuser[0]["bio"]).toBe(user.bio);
});

test("Adding a user and then recieving an error", async () => {
  const user = {
    bio: "here is my bio",
    profile_pic_url: "dasgg",
    albums: ["Album1", "Album2", "Album3"],
    artists: ["Artist 1", "Artist 2"],
    reviews: [],
  };

  const saved_user = await userServices.addUser(user);
  expect(saved_user.username).toBe(undefined);
});

test("Adding a user and then pushing a review", async () => {
  const user = {
    username: "iwantreview",
    bio: "here is my bio",
    profile_pic_url: "dasgg",
    albums: ["Album1", "Album2", "Album3"],
    artists: ["Artist 1", "Artist 2"],
    reviews: [],
  };

  const review1 = {
    username: "iwantreview",
    album: "Blonde",
    text: "God this is good",
  };

  const saved_user = await userServices.addUser(user);
  expect(saved_user.reviews.length).toBe(0);
  userServices.addReview(review1);
  const getuser = await userServices.findUserByUserName(user.username);
  console.log(getuser);
  //expect(getuser.reviews.length).toBe(1);
  //expect(getuser.review.text).tobe(review1.text);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});
