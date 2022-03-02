const mongoose = require("mongoose");
const UserSchema = require("./user");
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

async function findUserByUserName(username) {
  const userModel = getDbConnection().model("User", UserSchema);
  const result = await userModel.find({ username: username });
  return result;
  //   try {

  //   } catch (error) {
  //     console.log(error);
  //     return undefined;
  //   }
}

async function addUser(user) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addReview(review) {
  const userModel = getDbConnection().model("User", UserSchema);
  const username = review["username"];
  try{
    userModel.update({"username" : username}, { $push: {reviews: review}}, done);
    return True
  }
  catch (error) {
      console.log(error)
      return False
  }};



exports.addUser = addUser;
exports.findUserByUserName = findUserByUserName;
