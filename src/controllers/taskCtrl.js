const Task = require("../models/task");

const createTask = async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });
  await task.populate("author");
  try {
    await task.save();
    res.status(201).send({ message: "Task saved successfully", task });
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateTask = async (req, res) => {
  const allowedUpdates = Object.keys(Task.schema.obj);
  const toUpdate = Object.keys(req.body);
  const isValidUpdate = toUpdate.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate)
    return res.status(400).send({ message: "Invalid update" });

  try {
    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const task = await Task.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!task) return res.status(404).send({ message: "Task not found" });
    toUpdate.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send({ message: "Task Updated", task });
  } catch (error) {
    res.status(404).send(error);
  }
};

const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id: id, author: req.user._id });

    if (!task) return res.status(404).send({ message: "Task not found" });

    res.send({ message: "Task deleted" });
  } catch (error) {
    res.status(500).send();
  }
};

const getSingleTask = async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, author: req.user._id });
    if (!task) return res.status(404).send({});
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllTasks = async (req, res) => {
  const { limit, completed, skip, sortBy } = req.query;
  const sort = {};

  // in case you want to do multiple sorting
  //   const sort = {}
  //  if (req.query.sortBy) {
  //      const parts = req.query.sortBy.split('_')
  //      parts.forEach((part) => {
  //          const partSplit = part.split(':')
  //          sort[partSplit[0]] = partSplit[1] === "desc" ? -1 : 1
  //      })
  //  }

  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: "tasks",
      match: completed ? { completed } : {},
      options: {
        limit: limit ? limit : {},
        skip: skip ? skip : {},
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  getSingleTask,
  getAllTasks,
};
