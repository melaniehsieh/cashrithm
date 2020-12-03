const mongoose = require("mongoose");

const categorySchema= new mongoose.Schema({
  type: String,
  vendors: [String]
});

const childRevenueSchema = new mongoose.Schema({
  vendor: String,
  totalRevenue: Number
});

const childExpenseSchema = new mongoose.Schema({
  vendor: String,
  totalExpense: Number
});

const transactionRevenueSchema = new mongoose.Schema({
  revenue: [childRevenueSchema]
});

const transactionExpenseSchema = new mongoose.Schema({
  expense: [childExpenseSchema]
});

const entitiesSchema = new mongoose.Schema({
  name: String,
  email: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  category: [categorySchema],
  transactionExpense: [transactionExpenseSchema],
  transactionRevenue: [transactionRevenueSchema],
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Entities = new mongoose.model("Entities", entitiesSchema);

module.exports = Entities;