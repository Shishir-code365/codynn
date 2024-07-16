const router = require('express').Router();

const videoRouter = require('./video.routes');
const languageRouter = require('./language.routes');
const repositoryRouter = require('./repository.routes');
const jobRoleRouter = require('./jobRole.routes')
const interviewQuestionRouter = require('./interviewQues.routes')
const documentationRouter = require('./documentation.routes')

router.use('/videos', videoRouter);
router.use('/languages', languageRouter);
router.use('/repositories', repositoryRouter);
router.use('/jobroles', jobRoleRouter);
router.use('/interviewQuestions',interviewQuestionRouter)
router.use('/documentation',documentationRouter)

module.exports = router;