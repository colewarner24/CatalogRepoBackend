const mongoose = require("mongoose");
const PageSchema = require("./page");
const userServices = require("./user-services");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let conn;
let pageModel;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  pageModel = conn.model("Page", PageSchema);

  userServices.setConnection(conn);
});

test("Adding a page and getting a page", async () => {
  const page = {
    owner: "FatRat60",
    pageName: "Bullshit",
  };

  savedPage = await userServices.addPage(page);
  expect(savedPage.owner).toBe(page.owner);
  const getPage = await userServices.getFullPage(page.owner, page.pageName);
  expect(getPage).toBeDefined();
  expect(getPage.length).toBe(1);
  expect(getPage[0]["owner"]).toBe(page.owner);
});

test("Adding duplicate name page to same user", async () => {
  const page = {
    owner: "FatRat60",
    pageName: "Bullshit",
  };

  savedPage = await userServices.addPage(page);
  result = await userServices.addPage(page);
  expect(result).toBe(false);
});

test("Update existing page", async () => {
  const page = {
    owner: "FatRat60",
    pageName: "Bullshit",
  };

  await userServices.addPage(page);
  const updatedPage = {
    owner: "FatRat60",
    pageName: "Puta Madre",
  };
  newPage = await userServices.updatePage(updatedPage, page.pageName);
  expect(newPage).toBeDefined();
  expect(newPage.pageName).toBe(updatedPage.pageName);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});
