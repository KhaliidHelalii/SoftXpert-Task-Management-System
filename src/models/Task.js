  const mongoose = require('mongoose');

  const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  });

  const Task = mongoose.model('Task', taskSchema);

  module.exports = Task;
