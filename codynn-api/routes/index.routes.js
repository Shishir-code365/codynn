const router = require('express').Router();

const videoRouter = require('./video.routes');
const languageRouter = require('./language.routes');
const repositoryRouter = require('./repository.routes');

router.use('/videos', videoRouter);
router.use('/languages', languageRouter);
router.use('/repositories', repositoryRouter);

module.exports = router;