const express = require("express");

const router = express.Router();

const {getAllUser, getUser, deleteUser, deleteAllUser} = require("../controllers/userController");
const { signup, login, protect, restrictTo } = require("../controllers/authController");

router.route("/signup").post(signup);
router.route("/login").post(login);

router
  .route("/")
  .get(protect, getAllUser)
  .post()
  .delete(deleteAllUser);

router
  .route("/:id")
  .get(getUser)
  .post()
  .patch()
  .delete(protect, restrictTo("admin"), deleteUser);
  
module.exports = router;