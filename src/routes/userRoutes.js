const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const errorHandler = require("../middleware/error");

const {
  createUser,
  updateUser,
  deleteUser,
  logIn,
  logOut,
  logOutAll,
  getUserProfile,
  uploadProfilePic,
  deleteProfilePic,
  getAvatar,
} = require("../controllers/userCtrl");

router.route("/users/me").get(auth, getUserProfile).post(createUser);
router
  .route("/users/me/avatar")
  .post(auth, multer.single("avatar"), uploadProfilePic, errorHandler)
  .delete(auth, deleteProfilePic, errorHandler);

router.route("/users/login").post(logIn);
router.route("/users/logout").post(auth, logOut);
router.route("/users/logoutall").post(auth, logOutAll);

router.route("/users/me").patch(auth, updateUser).delete(auth, deleteUser);

router.route("/users/:id/avatar").get(getAvatar);
module.exports = router;
