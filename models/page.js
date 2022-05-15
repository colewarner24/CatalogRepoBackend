const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    pageName: {
      type: String,
      trim: true,
    },
    pagePic: {
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
  },

  { collection: "pages_list" }
);

module.exports = PageSchema;
