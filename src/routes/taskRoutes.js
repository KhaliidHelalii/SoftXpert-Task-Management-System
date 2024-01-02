const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Task endpoints
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.put('/:taskId', /* Add middleware for authentication */ taskController.updateTask);
// Add other task-related routes as needed

module.exports = router;
