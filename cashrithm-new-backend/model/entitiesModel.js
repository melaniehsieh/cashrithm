const mongoose = require("mongoose");

const categorySchema= new mongoose.Schema({
  type: String,
  vendors: [String]
});
/*
const childRevenueSchema = new mongoose.Schema({
  vendor: String,
  totalRevenue: Number
});

const childExpenseSchema = new mongoose.Schema({
  vendor: String,
  totalExpense: Number
});

const transactionRevenueSchema = new mongoose.Schema({
  revenue: [childRevenueSchema],
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const transactionExpenseSchema = new mongoose.Schema({
  expense: [childExpenseSchema],
  createdAt: {
    type: Date,
    default: new Date()
  } 
});*/

const childTransactionSchema = new mongoose.Schema({
  expenseVendor: String,
  totalExpense: Number,
  revenueVendor: String,
  totalRevenue: Number
});

const transactionSchema = new mongoose.Schema({
  title: String,
  allTotalRevenue: Number,
  allTotalExpense: Number,
  doc: [childTransactionSchema],
  createdAt: {
    type: Date,
    default: new Date()
  } 
});
/*
const revenueExpenseSchema = new mongoose.Schema({
  totalExpense: Number,
  totalRevenue: Number,
  createdAt: {
    type: Date,
    default: new Date()
  }
});*/

const entitiesSchema = new mongoose.Schema({
  name: String,
  email: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  category: [categorySchema],
  transaction: [transactionSchema],
  /*transactionExpense: [transactionExpenseSchema],
  transactionRevenue: [transactionRevenueSchema],
  totalRevenueExpense: [revenueExpenseSchema],*/
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Entities = new mongoose.model("Entities", entitiesSchema);

module.exports = Entities;