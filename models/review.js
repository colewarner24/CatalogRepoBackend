const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    album_name: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    rating: {
      type: String,
      trim: true,
    },
    reviewedItem: {
      type: Object,
    },
  },

  { collection: "reviews_list" }
);

module.exports = ReviewSchema;
