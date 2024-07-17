const router = require ('express').Router();
const { createQuestions, getQuestions,updateQuestions,deleteQuestions,searchQuestions } = require('../controllers/interviewQues.controller');
const paginationMiddleware = require('../middleware/pagination.middleware')


router.post('/create',paginationMiddleware(),createQuestions);
router.get('/get/:id?',paginationMiddleware(),getQuestions);
router.put('/update/:id',updateQuestions);
router.delete('/delete/:id',deleteQuestions);
router.get('/search/:search',searchQuestions);

module.exports = router;
