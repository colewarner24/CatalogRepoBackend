const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profile_pic_url: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    albums: {
      type: Array,
    },
    artists: {
      type: Array,
    },
    reviews: {
      type: Array,
    },
  },

  { collection: "users_list" }
);

module.exports = UserSchema;
