const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { validate } = require("../validations/register.validation");

//register
const register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { name, email, password } = req.body;
  let user = await User.findOne({ email: email });

  if (user) return res.status(400).send("user already exists");
  new_user = await new User({
    name,
    email,
    password,
  });

  const salt = await bcrypt.genSalt(10);
  new_user.password = await bcrypt.hash(new_user.password, salt);

  new_user = await new_user.save();

  res.send(
    _.pick(new_user, ["_id", "name", "email" ])
  );
};

//login
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User Account Not Available." });
    }

    let result = await bcrypt.compare(password, user.password);
    // console.log(password, user.password, "..........1");
    if (!result) {
      return res.status(400).json({ status: " Password Not Matches" });
    }

    let payload = {
      user: { id: user.id },
    };
    jwt.sign(payload, process.env.SECRETKEY, (err, token) => {
      if (err) throw err;
      // console.log(token);

      res.header("x-token", token).send({ msg: "login success" });
    });
  } catch (err) {
    if (err) throw err;
  }
};

const createTask = async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.status(200).json(savedTask);
  } catch (err) {
    res.status(500).json(err);
  }
}
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
      await task.updateOne({ $set: req.body });
      res.status(200).json("the task has been updated");
  } catch (err) {
    res.status(500).json(err);
  }
}
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
      await task.deleteOne();
      res.status(200).json("the task has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
}
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
}

module.exports =  { register, login, createTask, updateTask, deleteTask, getTask, getAllTasks }