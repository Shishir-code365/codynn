const repoModel = require('../models/repository.schema');

const createRepository = async (req, res) => {
    try {
        const MAX_REPOSITORIES_PER_PAGE = parseInt(req.query.limit);
        const { title, language, noOfLessons } = req.body;
        const repository = new repoModel({
            title,
            language,
            noOfLessons
        });
        await repository.save();
        const totalRepositories = await repoModel.countDocuments();
        const totalPages = Math.ceil(totalRepositories / MAX_REPOSITORIES_PER_PAGE);
        res.status(201).json({
            message: 'Repository created successfully',
            repository,
            totalRepositories: totalRepositories,
            totalPages: totalPages
        });
} catch (error) {
    console.error('Error creating repository:', error);
    res.status(500).json({ error: 'Server error' });
}
}

const getRepositories = async(req, res) => {
    try{

    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { createRepository,getRepositories};