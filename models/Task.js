const mongoose = require("mongoose");

let TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  file: { type: String, required: true },
  created: { type: Date, default: Date.now() },
});

let Task = mongoose.model("task", TaskSchema);
module.exports = Task;
