const VideoModel = require('../models/video.schema');
const LanguageModel = require('../models/language.schema');



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
