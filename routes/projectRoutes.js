const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.post('/', authMiddleware, adminMiddleware, projectController.createProject);
router.put('/:id', authMiddleware, adminMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, adminMiddleware, projectController.deleteProject);
// Add these routes to your existing router
router.post('/assign', authMiddleware, adminMiddleware, projectController.assignProject);
router.get('/assign/:userid', authMiddleware, projectController.getAssignedProjectsByUser);
router.post('/unassign', authMiddleware, adminMiddleware, projectController.unassignProject);

module.exports = router;
