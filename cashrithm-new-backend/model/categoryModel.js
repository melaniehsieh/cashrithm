const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  type: String,
  vendor: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const CatgoryCSV = new mongoose.model("CatgoryCSV", categorySchema);

module.exports = CatgoryCSV;