const express = require("express");

const router = express.Router();

const {getAllUserEntities, getUserEntities, deleteUserEntities, deleteAllUserEntities, getLoggedInUserEntities, getUserRecord} = require("../controllers/entitiesController");
const { protect, restrictTo } = require("../controllers/authController");

router
  .route("/user-entities")
  .get(protect, getLoggedInUserEntities);
  
router
  .route("/user-record/:id")
  .get(protect, getUserRecord);
  

router
  .route("/")
  .get(getAllUserEntities)
  .delete(protect, restrictTo("admin"), deleteAllUserEntities)

router
  .route("/:id")
  .get(protect, getUserEntities)
  .patch()
  .delete(protect, restrictTo("admin"), deleteUserEntities);
  
module.exports = router;