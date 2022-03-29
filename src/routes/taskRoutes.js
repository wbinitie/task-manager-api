const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  createTask,
  updateTask,
  deleteTask,
  getSingleTask,
  getAllTasks,
} = require("../controllers/taskCtrl");

router.route("/tasks").get(auth, getAllTasks).post(auth, createTask);

router
  .route("/tasks/:id")
  .get(auth, getSingleTask)
  .patch(auth, updateTask)
  .delete(auth, deleteTask);

module.exports = router;
