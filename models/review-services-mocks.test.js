const mongoose = require("mongoose");
const ReviewSchema = require("./review");
const userServices = require("./user-services");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let conn;
let reviewModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  reviewModel = conn.model("Review", ReviewSchema);

  userServices.setConnection(conn);
});

test("Adding review and getting review", async () => {
  const review = {
    owner: "Garsh",
    reviewedItem: "poop",
    rating: "3.5",
  };

  const user = {
    username: "Garsh",
    password: "chiefkeeflive@theforum",
  };

  // Add User
  console.log(await userServices.addUser(user));

  // Add review
  addedReview = await userServices.addReview(review);
  expect(addedReview).toBe(true);

  // Retrieve review
  gotReview = await userServices.getReview(review.owner, review.reviewedItem);
  expect(gotReview).toBeDefined();
  expect(gotReview.length).toBe(1);
  expect(gotReview[0]["owner"]).toBe(review.owner);
});

test("Adding duplicate review to same user", async () => {
  const review = {
    owner: "Garsh",
    reviewedItem: "poop",
    rating: "3.5",
  };

  const user = {
    username: "Garsh",
    password: "chiefkeeflive@theforum",
  };

  // Add User
  console.log(await userServices.addUser(user));

  // add first time
  await userServices.addReview(review);
  // try second add
  result = await userServices.addReview(review);
  expect(result).toBe(false);
});

test("update existing review", async () => {
  const review = {
    owner: "Garsh",
    reviewedItem: "poop",
    rating: "3.5",
  };

  // add first time
  await userServices.addReview(review);
  // change reviewedItem and update db one
  review.rating = "4.5";
  editedReview = await userServices.updateReview(review);
  expect(editedReview.rating).toBe("4.5");
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});
