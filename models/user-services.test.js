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

// tests passed inconsistently
// test("Searching up an album on Spotify API", async () => {
//   const albumName = "Blonde";
//   const album = await userServices.getAlbum(albumName);
//   expect(album).toBeDefined();
//   expect(album.body.albums.items[0].name).toBe(albumName);
// });

// test("Searching up an album on Spotify API 2", async () => {
//   const albumName = "Back In Black";
//   const album = await userServices.getAlbum(albumName);
//   expect(album).toBeDefined();
//   expect(album.body.albums.items[0].name).toBe(albumName);
// });

// test("Searching up an artist on Spotify API", async () => {
//   const artistName = "Garth Brooks";
//   const artist = await userServices.getArtist(artistName);
//   expect(artist).toBeDefined();
//   expect(artist.body.artists.items[0].name).toBe(artistName);
// });

// test("Searching up an artist on Spotify API 2", async () => {
//   const artistName = "Frank Ocean";
//   const artist = await userServices.getArtist(artistName);
//   expect(artist).toBeDefined();
//   expect(artist.body.artists.items[0].name).toBe(artistName);
// });

test("Adding a user and then getting a user", async () => {
  const user = {
    username: "Nickisadog",
    password: "garsh",
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

test("Finding a non existant user", async () => {
  const saved_user = await userServices.findUserByUserName("sgagfsgsd");
  expect(saved_user).toEqual([]);
});

test("Adding a duplicate user", async () => {
  const user1 = {
    username: "a new test",
    password: "garsh",
    bio: "here is my bio",
    profile_pic_url: "dasgg",
    albums: ["Album1", "Album2", "Album3"],
    artists: ["Artist 1", "Artist 2"],
    reviews: [],
  };

  const saved_user1 = await userServices.addUser(user1);
  const saved_user2 = await userServices.addUser(user1);
  expect(saved_user1.username).toBe("a new test");
  expect(saved_user2).toBe(false);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});
