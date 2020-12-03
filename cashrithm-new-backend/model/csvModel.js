const mongoose = require("mongoose");

const userCSVSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  csvId: Number,
  date: {
    type: Date
  },
  vendor: {
    type: String
  },
  amount: {
    type: Number
  },
  select: {
    type: String
  },
  option: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const CSV = new mongoose.model("CSV", userCSVSchema);

module.exports = CSV;