const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

mongoose
    .connect(
        "mongodb+srv://alexitbali:ARozaz1812--@todolistcluster.5jhvs6j.mongodb.net/tasksDB?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .catch((error) => console.log(error));

const taskSchema = new mongoose.Schema({
    title: String,
    done: Boolean,
    dateCreated: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

//get all tasks
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.send(tasks);
});
// post new task
app.post("/tasks", async (req, res) => {
    const task = new Task({
        title: req.body.title,
        done: req.body.done,
        dateCreated: req.body.dateCreated,
    });
    await task.save();
    res.send(task);
});
//update task
app.put("/tasks/:id", async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    let task = await Task.findOne({ _id: id });
    const updatedTask = task.set(req.body);
    updatedTask.save();
    res.send(updatedTask);
});
//delete task
app.delete("/tasks/:id", async (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const result = await Task.deleteOne({ _id: id });
    res.send(result);
});

app.listen(3000, () => console.log("Server listening on port 3000"));
