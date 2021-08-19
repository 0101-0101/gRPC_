const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    postImage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("news", NewsSchema);
