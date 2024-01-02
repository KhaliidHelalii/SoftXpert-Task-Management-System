const express = require('express');
const dependencyController = require('../controllers/dependencyController');

const router = express.Router();

// Dependency endpoints
router.post('/', dependencyController.addDependency);
router.get('/:taskId/dependencies', dependencyController.getTaskDependencies);
// Add other dependency-related routes as needed

module.exports = router;
