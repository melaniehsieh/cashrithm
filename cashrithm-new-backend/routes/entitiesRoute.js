const express = require("express");

const router = express.Router();

const {getAllUserEntities, getUserEntities, deleteUserEntities, deleteAllUserEntities, getLoggedInUserEntities, getUserRecord} = require("../controllers/entitiesController");
const { protect, restrictTo } = require("../controllers/authController");

// Route protected
router.use(protect)

router
  .route("/user-entities")
  .get(getLoggedInUserEntities);
  
router
  .route("/user-record/:id")
  .get(getUserRecord);
  

router
  .route("/")
  .get(getAllUserEntities)
  .delete(restrictTo("admin"), deleteAllUserEntities)

router
  .route("/:id")
  .get(getUserEntities)
  .patch()
  .delete(restrictTo("admin"), deleteUserEntities);
  
module.exports = router;