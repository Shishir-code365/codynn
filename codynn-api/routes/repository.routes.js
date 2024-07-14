const router = require('express').Router();
const {createRepository} = require('../controllers/repository.controller');
const paginationMiddleware = require('../middleware/pagination.middleware');

router.post('/create',paginationMiddleware(), createRepository);


module.exports = router;