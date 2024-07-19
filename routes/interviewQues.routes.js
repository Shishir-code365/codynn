const router = require ('express').Router();
const { createQuestions, getQuestions,updateQuestions,deleteQuestions} = require('../controllers/interviewQues.controller');
const paginationMiddleware = require('../middleware/pagination.middleware')


router.post('/create',paginationMiddleware(),createQuestions);
router.get('/get/:id?',getQuestions);
router.put('/update/:id',updateQuestions);
router.delete('/delete/:id',deleteQuestions);

module.exports = router;
