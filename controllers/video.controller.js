const VideoModel = require('../models/video.schema');
const LanguageModel = require('../models/language.schema');

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the video.
 *         image:
 *           type: string
 *           description: URL or path to the image associated with the video.
 *         duration:
 *           type: string
 *           description: Duration of the video.
 *         title:
 *           type: string
 *           description: Title of the video.
 *         level:
 *           type: string
 *           enum: [beginner, advanced, intermediate]
 *           description: Difficulty level of the video.
 *         language:
 *           type: string
 *           description: ID of the language associated with the video.
 *         url:
 *           type: string
 *           description: URL of the video content.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the video was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the video was last updated.
 *       required:
 *         - duration
 *         - title
 *         - level
 *         - language
 *         - url
 */

/**
 * @swagger
 * /api/videos/create:
 *   post:
 *     summary: Create a new video
 *     tags: [Video]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Video'
 *     responses:
 *       '201':
 *         description: Video created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video created successfully
 *                 video:
 *                   $ref: '#/components/schemas/Video'
 *                 totalVideos:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *       '400':
 *         description: Invalid language ID or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

const createVideo = async (req, res) => {
    try {
        const MAX_VIDEOS_PER_PAGE = parseInt(req.query.limit);
        const { image, duration, title, level, language,url } = req.body;

        const languageExists = await LanguageModel.findById(language);
        if (!languageExists) {
            return res.status(400).json({ error: 'Invalid language ID' });
        }

        const video = new VideoModel({
            image,
            duration,
            title,
            level,
            language,
            url
        });

        await video.save();

        const totalVideos = await VideoModel.countDocuments();
        const totalPages = Math.ceil(totalVideos / MAX_VIDEOS_PER_PAGE);

        res.status(201).json({
            message: 'Video created successfully',
            video,
            totalVideos: totalVideos,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @swagger
 * /api/videos/get:
 *   get:
 *     summary: Get all videos with pagination
 *     tags: [Video]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: The number of videos to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: The page number.
 *     responses:
 *       '200':
 *         description: Successful response with all videos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 videos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Video'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

const getVideos = async (req, res) => {
    try {
        const MAX_VIDEOS_PER_PAGE = parseInt(req.query.limit);
        const { startIndex, limit } = req.pagination;

        const videos = await VideoModel.find()
            .populate('language')
            .limit(limit)
            .skip(startIndex);

        const totalVideos = await VideoModel.countDocuments();
        const totalPages = Math.ceil(totalVideos / MAX_VIDEOS_PER_PAGE);

        res.status(200).json({
            total: totalVideos,
            page: req.pagination.page,
            limit: req.pagination.limit,
            totalPages: totalPages,
            videos
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @swagger
 * /api/videos/get/{id}:
 *   get:
 *     summary: Get a video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to get
 *     responses:
 *       '200':
 *         description: Successful response with the video
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Video'
 *       '404':
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


const getVideoByID = async (req, res) => {
    try {
        const videoID = req.params.id;
        const video = await VideoModel.findById(videoID).populate('language');
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.status(200).json({ video });
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @swagger
 * /api/videos/delete/{id}:
 *   delete:
 *     summary: Delete a video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to delete
 *     responses:
 *       '200':
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedVideo:
 *                   $ref: '#/components/schemas/Video'
 *       '404':
 *         description: Video not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


const deleteVideo = async (req, res) => {
    try {
        const videoID = req.params.id;
        const deletedVideo = await VideoModel.findByIdAndDelete(videoID);
        if (!deletedVideo) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.status(200).json({ message: 'Video deleted successfully', deletedVideo });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @swagger
 * /api/videos/update/{id}:
 *   put:
 *     summary: Update a video by ID
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Video'
 *     responses:
 *       '200':
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Video updated successfully
 *                 video:
 *                   $ref: '#/components/schemas/Video'
 *       '404':
 *         description: Video not found or Language not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Video not found or Language not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */

const updateVideo = async (req, res) => {
    try {
        const videoID = req.params.id;
        const { image, duration, title, level, language } = req.body;
        const video = await VideoModel.findByIdAndUpdate(videoID, {
            image,
            duration,
            title,
            level,
            language,
            url
        }, { new: true });
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.status(200).json({ message: 'Video updated successfully', video });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @swagger
 * /api/videos/search/{search}:
 *   get:
 *     summary: Search videos by title
 *     tags: [Video]
 *     parameters:
 *       - in: path
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term for the video title
 *     responses:
 *       '200':
 *         description: Successful response with matching videos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


const searchVideo = async (req, res) => {
    try {
        const searchTerm = req.params.search;
        const videos = await VideoModel.find({ title: { $regex: searchTerm, $options: 'i' } });//param search
        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error searching videos:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { createVideo, getVideos,getVideoByID, deleteVideo, updateVideo, searchVideo };
