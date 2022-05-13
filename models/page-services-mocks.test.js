const mongoose = require("mongoose");
const PageSchema = require("./page");
const pageServices = require("./page-services");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { TestWatcher } = require("jest");

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

test("Adding a page and getting a page", async () => {
    const page = {
        owner: "FatRat60",
        pageName: "Bullshit",
    };

    savedPage = await pageServices.addPage(page);
    expect(savedPage.owner).toBe(page.owner);

    const getPage = await pageServices.getFullPage(page.owner, page.pageName);
    expect(getPage).toBeDefined();
    expect(getPage.length).toBe(1);
    expect(getPage[0]["owner"]).toBe(page.owner);
});

afterAll(async () => {
    await conn.dropDatabase();
    await conn.close();
    await mongoServer.stop();
  });
