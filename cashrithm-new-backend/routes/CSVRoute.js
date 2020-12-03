const express = require("express");
const { getAllTransactionCSVDoc, deleteAllTransactionCSVDoc, getAllCategoryCSVDoc, deleteAllCategoryCSVDoc, calcBasedOnSelectExpense, calcBasedOnSelectRevenue, categorizeByVendor } = require("../controllers/csvController")
const {protect} = require("../controllers/authController");


const router = express.Router();

router
  .route("/transaction")
  .get(getAllTransactionCSVDoc)
  .delete(deleteAllTransactionCSVDoc);
 
router
  .route("/category")
  .get(getAllCategoryCSVDoc)
  .delete(deleteAllCategoryCSVDoc);
  

router
  .route("/calc-based-select-expense")
  .get(protect, calcBasedOnSelectExpense);

router
  .route("/calc-based-select-revenue")
  .get(protect, calcBasedOnSelectRevenue);

router
  .route("/categorize-by-vendor")
  .get(protect, categorizeByVendor);

module.exports = router;