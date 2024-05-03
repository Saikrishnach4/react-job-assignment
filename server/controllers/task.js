const mongoose = require('mongoose');
const Task = require('../models/task');
const ObjectId = mongoose.Types.ObjectId;

const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const userId = req.params.userId;

    const task = new Task({
      userId,
      title,
      description,
      priority, 
    });

    await task.save();

    res.status(201).json({ message: 'Task created successfully', taskId: task._id });
  } catch (error) {
    console.error('Error creating task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tasks = await Task.find({ userId });

    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateTask = async (req, res) => {
  const userId = req.params.userId;
  const taskId=req.params.taskId;
console.log(req.params.userId)
  const { title, description, priority } = req.body; 

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { userId, _id: taskId },
      { title, description, priority }, 
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteTask = async (req, res) => {
  const userId = req.params.userId;
  const taskId = req.body.taskId;

  try {
    if (!ObjectId.isValid(taskId)) { 
      return res.status(400).json({ message: 'Invalid Task ID' });
    }

    const deletedTask = await Task.findOneAndDelete({ userId, _id: new ObjectId(taskId) });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
