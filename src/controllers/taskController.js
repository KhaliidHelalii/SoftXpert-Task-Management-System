const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignee, dueDate } = req.body;

    // Check if assignee exists
    const assignedUser = await User.findById(assignee);
    if (!assignedUser) {
      return res.status(400).json({ message: 'Invalid assignee ID' });
    }

    const newTask = new Task({
      title,
      description,
      assignee,
      dueDate,
    });

    await newTask.save();

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    next(error);
  }
};

// Retrieve a list of all tasks with optional filtering
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, dueDateRange, assignedUser } = req.query;

    // Build query based on filters
    const query = {};
    if (status) {
      query.status = status;
    }
    if (dueDateRange) {
      // Implement dueDateRange filtering logic
    }
    if (assignedUser) {
      query.assignee = assignedUser;
    }

    const tasks = await Task.find(query);

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

// Add task dependencies with other tasks
exports.addTaskDependencies = async (req, res, next) => {
  try {
    const { taskId, dependencies } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify that all dependencies exist
    const invalidDependencies = dependencies.filter(depId => !mongoose.Types.ObjectId.isValid(depId));
    if (invalidDependencies.length > 0) {
      return res.status(400).json({ message: 'Invalid dependency ID(s)' });
    }

    // Update task dependencies
    task.dependencies = dependencies;

    await task.save();

    res.json({ message: 'Task dependencies added successfully', task });
  } catch (error) {
    next(error);
  }
};

// Retrieve details of a specific task including dependencies
exports.getTaskDetails = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId).populate('dependencies');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// Update the details of a task
exports.updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, assignee, dueDate, status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check authorization
    if (req.user.role === 'manager' || task.assignee.equals(req.user._id)) {
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignee) task.assignee = assignee;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;

      await task.save();

      res.json({ message: 'Task updated successfully', task });
    } else {
      res.status(403).json({ message: 'Unauthorized to update this task' });
    }
  } catch (error) {
    next(error);
  }
};
