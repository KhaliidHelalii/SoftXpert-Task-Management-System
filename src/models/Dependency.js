const mongoose = require('mongoose');

const dependencySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  dependencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
});

const Dependency = mongoose.model('Dependency', dependencySchema);

module.exports = Dependency;
