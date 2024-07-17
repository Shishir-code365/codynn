const { createJobRole, getJobRoles, updateJobRole, deleteJobRole } = require('../controllers/jobRole.controller');

const router = require('express').Router();


router.post('/create', createJobRole);
router.get('/get/:id?',getJobRoles);
router.put('/update/:id',updateJobRole);
router.delete('/delete/:id',deleteJobRole);

module.exports = router;

