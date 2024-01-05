const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, assignee, dueDate, dependencies } = req.body;

    // Check if assignee exists only if provided
    if (assignee) {
      const assignedUser = await User.findById(assignee);
      if (!assignedUser) {
        return res.status(400).json({ message: 'Invalid assignee ID' });
      }
    }

    // Verify that all dependencies exist
    const invalidDependencies = dependencies.filter(depId => !mongoose.Types.ObjectId.isValid(depId));
    if (invalidDependencies.length > 0) {
      return res.status(400).json({ message: 'Invalid dependency ID(s)' });
    }

    const existingDependencies = await Task.find({ _id: { $in: dependencies } });
    if (existingDependencies.length !== dependencies.length) {
      return res.status(400).json({ message: 'Some dependencies do not exist' });
    }

    const newTask = new Task({
      title,
      description,
      assignee,
      dueDate,
      dependencies,
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

    // Check if all dependencies exist in the database
    const existingDependencies = await Task.find({ _id: { $in: dependencies } });
    if (existingDependencies.length !== dependencies.length) {
      return res.status(400).json({ message: 'Some dependencies do not exist' });
    }

    // Update task dependencies
    task.dependencies = dependencies;

    await task.save();

    res.json({ message: 'Task dependencies added successfully', task });
  } catch (error) {
    next(error);
  }
};

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
    const { title, description, assignee, dueDate, status, dependencies } = req.body;
    console.log(taskId);

    const task = await Task.findById(taskId).populate('dependencies');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Log dependency IDs
    task.dependencies.forEach(dep => console.log('Dependency ID:', dep._id));

    const allDependenciesCompleted = task.dependencies.every(dep => dep.status === 'completed');
    if (!allDependenciesCompleted && status === 'completed') {
      return res.status(400).json({ message: 'Some dependencies are not completed' });
    }

    // Check authorization
    if (req.user.role === 'manager' || (task.assignee && task.assignee.equals(req.user._id))) {
      // Validate and update assignee if provided
      if (assignee) {
        const assignedUser = await User.findById(assignee);
        if (!assignedUser) {
          throw new Error('Invalid assignee ID');
        }
        task.assignee = assignee;
      }

      // Validate and update dependencies
      if (dependencies) {
        const invalidDependencies = dependencies.filter(depId => !mongoose.Types.ObjectId.isValid(depId));
        if (invalidDependencies.length > 0) {
          return res.status(400).json({ message: 'Invalid dependency ID(s)' });
        }

        // Log input dependencies array
        console.log('Input dependencies:', dependencies);

        const existingDependencies = await Task.find({ _id: { $in: dependencies } });

        // Log IDs of existing dependencies
        if (!existingDependencies || existingDependencies.length !== dependencies.length) {
          return res.status(400).json({ message: 'Some dependencies do not exist' });
        }

        // Log dependencies being checked
        console.log('Checking dependencies:', existingDependencies.map(dep => dep._id));

        // Check if all dependencies are completed
        const incompleteDependencies = existingDependencies.some(dep => dep.status !== 'completed');
        if (incompleteDependencies && status === 'completed') {
          return res.status(400).json({ message: 'Some dependencies are not completed' });
        }

        task.dependencies = dependencies;
      }

      // Only allow updating status if the user is assigned to the task
      if (req.user.role === 'manager' || (task.assignee && task.assignee.equals(req.user._id))) {
        if (status) {
          if (!['pending', 'completed', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
          }
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
    } else {
      res.status(403).json({ message: 'Unauthorized to update this task' });
    }
  } catch (error) {
    next(error);
  }
};

