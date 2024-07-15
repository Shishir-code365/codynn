const router = require('express').Router();
const {createRepository,getRepositories,deleteRepository,upateRepository,searchRepo} = require('../controllers/repository.controller');
const paginationMiddleware = require('../middleware/pagination.middleware');

router.post('/create',paginationMiddleware(), createRepository);
router.get('/get/:id?', paginationMiddleware(), getRepositories);
router.put('/update/:id', upateRepository);
router.delete('/delete/:id', deleteRepository);
router.get('/search', searchRepo);


module.exports = router;