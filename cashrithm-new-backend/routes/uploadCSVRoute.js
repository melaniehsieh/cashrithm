const express = require("express");

const { uploadTransactionCsv, uploadCSV, getAllTrasactionCSVDoc, uploadCategoryCsv } = require("../controllers/csvController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router
  .route("/transaction")
  .post(protect, uploadCSV, uploadTransactionCsv);

router
  .route("/category")
  .post(protect, uploadCSV, uploadCategoryCsv);
  
/*
router
  .route("/csv")
  .get(getAllTrasactionCSVDoc);
*/
module.exports = router;