const mongoose = require("mongoose");
const PageSchema = require("./page");
const dotenv = require("dotenv");
dotenv.config();

let dbConnection;
  
function getDbConnection() {
    if (!dbConnection) {
      dbConnection = mongoose.createConnection(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    return dbConnection;
}

// Returns name of all pages for a single user
// Might not need this one
async function getAllPages(username) {
    const pageModel = getDbConnection().model("Page", PageSchema);
    const result = await pageModel.find( { owner: username },
        { projection: { pageName: 1 } });
    return result;
}

// Returns specific page of user
export async function getFullPage(username, pageName) {
    const pageModel = getDbConnection().model("Page", PageSchema);
    const page = await pageModel.find( { owner: username, pageName: pageName });
    return page;
}

// Adds a page to the user if pageName doesn't already exist
export async function addPage(page) {
    const pageModel = getDbConnection().model("Page", PageSchema);
    const page = await getFullPage(page.owner, page.pageName);
    if (page) {
        console.log("Page with that name already");
        return false;
    }
    try {
        console.log("adding page");
        const pageToAdd = new pageModel(page);
        const savedPage = await pageToAdd.save();
        return savedPage;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

// Updates an already made page
export async function updatePage(newPage) {
    const pageModel = getDbConnection().model("Page", PageSchema);
    page = getFullPage(newPage.owner, newPage.pageName);
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
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
