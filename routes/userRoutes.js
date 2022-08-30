const express = require('express');
const router = express.Router();

const { register, login, createTask, updateTask, deleteTask, getTask, getAllTasks } = require('../controllers/userController')

router.post("/register", register);
router.post("/login", login);
router.post("/create-task", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/:id", getTask);
router.get("/all", getAllTasks);

module.exports = router;