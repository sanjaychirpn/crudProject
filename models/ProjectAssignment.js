const mongoose = require('mongoose');

const ProjectAssignmentSchema = new mongoose.Schema({
    projectid: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assigndate: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ['assigned', 'in progress', 'completed'], default: 'assigned' }
});

module.exports = mongoose.model('ProjectAssignment', ProjectAssignmentSchema);
