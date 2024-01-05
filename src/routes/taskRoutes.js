const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Task endpoints
router.post('/', authMiddleware.authenticate, roleMiddleware(['manager']), taskController.createTask);
router.get('/', authMiddleware.authenticate, taskController.getAllTasks);
router.put('/:taskId', authMiddleware.authenticate, roleMiddleware(['manager']), taskController.updateTask);
router.post('/dependencies', authMiddleware.authenticate, roleMiddleware(['manager']), taskController.addTaskDependencies);
router.get('/:taskId', authMiddleware.authenticate, taskController.getTaskDetails);
// Add other task-related routes as needed

module.exports = router;
