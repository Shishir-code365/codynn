const router = require('express').Router();

const videoRouter = require('./video.routes');
const languageRouter = require('./language.routes');

router.use('/videos', videoRouter);
router.use('/languages', languageRouter);

module.exports = router;