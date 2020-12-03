const express = require("express");

const router = express.Router();

const {getAllUserEntities, getUserEntities, deleteUserEntities, getLoggedInUserEntities} = require("../controllers/entitiesController");
const { protect, restrictTo } = require("../controllers/authController");

router
  .route("/user-entities")
  .get(protect, getLoggedInUserEntities);
  

router
  .route("/")
  .get(getAllUserEntities)
  //.delete(deleteAllUserEntities)

router
  .route("/:id")
  .get(protect, getUserEntities)
  .patch()
  .delete(deleteUserEntities);
  
module.exports = router;