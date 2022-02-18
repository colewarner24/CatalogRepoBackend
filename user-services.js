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

async function findUserByUserName(name) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    return await userModel.find({ name: name });
  } catch (error) {
    console.log(error);
    return undefined;
  }
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

exports.addUser = addUser;
exports.findUserByUserName = findUserByUserName;
