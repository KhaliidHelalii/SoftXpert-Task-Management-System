const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');



exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignee, dueDate } = req.body;

    // Check if assignee exists only if provided
    if (assignee) {
      const assignedUser = await User.findById(assignee);
      if (!assignedUser) {
        return res.status(400).json({ message: 'Invalid assignee ID' });
      }
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

exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, dueDateRange } = req.query;
    const assignedUser = req.user._id; // Use the authenticated user's ID

    // Build query based on filters
    const query = {};
    if (status) {
      query.status = status;
    }
    if (dueDateRange) {
      // Implement dueDateRange filtering logic
    }

    if (assignedUser) {
      // Check if the specified user has any assigned tasks
      const userTasks = await Task.find({ assignee: assignedUser });

      if (userTasks.length === 0) {
        return res.status(404).json({ message: 'No tasks assigned to this user' });
      }

      query.assignee = assignedUser;
    }

    const tasks = await Task.find(query);

    res.json({ tasks });
  } catch (error) {
    next(error);
  }
};

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
      try {
        if (assignee && !assignee.equals(task.assignee)) {
          // If the user tries to update the assignee field, check authorization
          if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Unauthorized to update assignee for this task' });
          }
          const assignedUser = await User.findById(assignee);
          if (!assignedUser) {
            throw new Error('Invalid assignee ID');
          }
          task.assignee = assignee;
        }

        // Only allow updating status if the user is assigned to the task
        if (req.user.role === 'manager' || task.assignee.equals(req.user._id)) {
          if (status) {
            task.status = status;
          }
        } else {
          return res.status(403).json({ message: 'Unauthorized to update this task' });
        }

        // Update other fields if present and user is a manager
        if (req.user.role === 'manager') {
          if (title) task.title = title;
          if (description) task.description = description;
          if (dueDate) task.dueDate = dueDate;
        } else {
          // If the user is not a manager, only allow updating the status
          if (title || description || dueDate) {
            return res.status(403).json({ message: 'Unauthorized to update fields other than status' });
          }
        }

        await task.save();

        res.json({ message: 'Task updated successfully', task });
      } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
          // Handle CastError (invalid ObjectId)
          return res.status(400).json({ message: 'Invalid field update' });
        }
        throw error; // Rethrow other errors
      }
    } else {
      res.status(403).json({ message: 'Unauthorized to update this task' });
    }
  } catch (error) {
    next(error);
  }
};

