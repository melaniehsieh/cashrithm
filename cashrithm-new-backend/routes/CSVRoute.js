const express = require("express");
const { getAllTransactionCSVDoc, deleteAllTransactionCSVDoc, getAllCategoryCSVDoc, deleteAllCategoryCSVDoc, calcBasedOnSelect, calcBasedOnSelectRevenue, categorizeByVendor } = require("../controllers/csvController")
const {protect, restrictTo} = require("../controllers/authController");


const router = express.Router();

router
  .route("/transaction")
  .get(protect, getAllTransactionCSVDoc)
  .delete(protect, restrictTo("admin"), deleteAllTransactionCSVDoc);
 
router
  .route("/category")
  .get(protect, getAllCategoryCSVDoc)
  .delete(protect, restrictTo("admin"), deleteAllCategoryCSVDoc);
  

router
  .route("/calc-based-select")
  .get(protect, calcBasedOnSelect);

router
  .route("/calc-based-select-revenue")
  .get(protect, calcBasedOnSelectRevenue);

router
  .route("/categorize-by-vendor")
  .get(protect, categorizeByVendor);

module.exports = router;