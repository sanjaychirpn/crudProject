const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const { sendResponse } = require('../utils/responseHelper');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        sendResponse(res, 200, 'Projects retrieved successfully', projects);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return sendResponse(res, 404, 'Project not found');
        sendResponse(res, 200, 'Project retrieved successfully', project);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.createProject = async (req, res) => {
    const { projectname, shortdescr, descr, client, phone, address, status } = req.body;

    try {
        const newProject = new Project({ projectname, shortdescr, descr, client, phone, address, status });
        const project = await newProject.save();
        sendResponse(res, 201, 'Project created successfully', project);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.updateProject = async (req, res) => {
    const { projectname, shortdescr, descr, client, phone, address, status } = req.body;

    const updatedProject = { projectname, shortdescr, descr, client, phone, address, status };

    try {
        const project = await Project.findByIdAndUpdate(req.params.id, updatedProject, { new: true });
        if (!project) return sendResponse(res, 404, 'Project not found');
        sendResponse(res, 200, 'Project updated successfully', project);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return sendResponse(res, 404, 'Project not found');
        sendResponse(res, 200, 'Project removed successfully');
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

// Add these methods to your projectController

exports.getAssignedProjectsByUser = async (req, res) => {
    try {
        const assignments = await ProjectAssignment.find({ userid: req.params.userid }).populate('projectid');
        if (assignments.length === 0) return sendResponse(res, 404, 'No assignments found for this user');
        sendResponse(res, 200, 'Assignments retrieved successfully', assignments);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.unassignProject = async (req, res) => {
    const { projectid, userid } = req.body;

    try {
        const assignment = await ProjectAssignment.findOneAndDelete({ projectid, userid });
        if (!assignment) return sendResponse(res, 404, 'Assignment not found');
        sendResponse(res, 200, 'Project unassigned successfully');
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};

exports.assignProject = async (req, res) => {
    const { projectid, userid, assigndate, duration, status } = req.body;

    try {
        // Check if the project is already assigned
        const existingAssignment = await ProjectAssignment.findOne({ projectid });
        if (existingAssignment) return sendResponse(res, 400, 'Project is already assigned to a user');

        const newAssignment = new ProjectAssignment({ projectid, userid, assigndate, duration, status });
        const assignment = await newAssignment.save();
        sendResponse(res, 201, 'Project assigned successfully', assignment);
    } catch (err) {
        console.error(err.message);
        sendResponse(res, 500, 'Server error');
    }
};
