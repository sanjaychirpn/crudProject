const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectname: { type: String, required: true },
    shortdescr: { type: String },
    descr: { type: String },
    client: { type: String },
    phone: { type: String },
    address: { type: String },
    status: { type: String, enum: ['ongoing', 'completed', 'pending'], default: 'pending' }
});

module.exports = mongoose.model('Project', ProjectSchema);
