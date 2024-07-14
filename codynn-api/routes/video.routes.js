const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const paginationMiddleware = require('../middleware/pagination.middleware');

router.post('/create',paginationMiddleware(), videoController.createVideo);
router.get('/get', paginationMiddleware(), videoController.getVideos);
router.get('/get/:id', videoController.getVideoByID);
router.delete('/delete/:id', videoController.deleteVideo);
router.put('/update/:id', videoController.updateVideo);
router.get('/search', videoController.searchVideo);

module.exports = router
