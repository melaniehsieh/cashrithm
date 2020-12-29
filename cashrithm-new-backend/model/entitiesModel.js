const mongoose = require("mongoose");

const categorySchema= new mongoose.Schema({
  type: String,
  vendors: [String]
});
/*
const childTransactionSchema = new mongoose.Schema({
  expenseVendor: String,
  totalExpense: Number,
  revenueVendor: String,
  totalRevenue: Number
});*/
const subChildTransactionSchema = new mongoose.Schema({
  vendor: String,
  value: Number
});

const childTransactionSchema = new mongoose.Schema({
  category: String,
  vendor_details: [subChildTransactionSchema]
})

const childOptionSchema = new mongoose.Schema({
  option: String,
  total_by_option: String
});

const transactionSchema = new mongoose.Schema({
  title: String,
  all_total_revenue: Number,
  all_total_expense: Number,
  category_by_vendor: [childTransactionSchema],
  total_doc_by_option: [childOptionSchema],
  createdAt: {
    type: Date,
    default: new Date()
  } 
});


const entitiesSchema = new mongoose.Schema({
  name: String,
  email: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  category: [categorySchema],
  transaction: [transactionSchema],
  createdAt: {
    type: Date,
    default: new Date()
  }
});

const Entities = new mongoose.model("Entities", entitiesSchema);

module.exports = Entities;