const express = require("express");
const { getAllTransactionCSVDoc, deleteAllTransactionCSVDoc, getAllCategoryCSVDoc, deleteAllCategoryCSVDoc, calcBasedOnSelect, calcBasedOnSelectRevenue, categorizeByVendor } = require("../controllers/csvController")
const {protect, restrictTo} = require("../controllers/authController");


const router = express.Router();

// All route downward are protected
router.use(protect)

router
  .route("/transaction")
  .get(protect, getAllTransactionCSVDoc)
  .delete(protect, restrictTo("admin"), deleteAllTransactionCSVDoc);
 
router
  .route("/category")
  .get(getAllCategoryCSVDoc)
  .delete(restrictTo("admin"), deleteAllCategoryCSVDoc);
  

router
  .route("/calc-based-select")
  .get(calcBasedOnSelect);

router
  .route("/calc-based-select-revenue")
  .get(calcBasedOnSelectRevenue);

router
  .route("/categorize-by-vendor")
  .get(categorizeByVendor);

module.exports = router;