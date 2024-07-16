const router = require('express').Router();
const { createDocumentation, getDocumentation, sortDocumentation, updateDocumentation, deleteDocumentation } = require('../controllers/documentation.controller');
const paginationMiddleware = require('../middleware/pagination.middleware')

router.post('/create',paginationMiddleware(),createDocumentation);
router.get('/get/:id?',paginationMiddleware(),getDocumentation);
router.get('/sort',sortDocumentation);
router.put('/update/:id',updateDocumentation);
router.delete('/delete/:id',deleteDocumentation);

module.exports = router;