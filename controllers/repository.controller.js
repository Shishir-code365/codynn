const repoModel = require('../models/repository.schema');
const languageModel = require('../models/language.schema');
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

        const repoID = req.params.id;
        if(repoID)
        {
            const repository = await repoModel.findById(repoID).populate('language');
            if (!repository) {
                return res.status(404).json({ error: 'Repository not found' });
            }
            return res.status(200).json({ repository });
        }
        const MAX_REPOSITORIES_PER_PAGE = parseInt(req.query.limit);
        const { startIndex, limit } = req.pagination;
        const repositories = await repoModel.find()
            .populate('language')
            .limit(limit)
            .skip(startIndex);
        const totalRepositories = await repoModel.countDocuments();
        const totalPages = Math.ceil(totalRepositories / MAX_REPOSITORIES_PER_PAGE);
        res.status(200).json({
            total: totalRepositories,
            page: req.pagination.page,
            limit: req.pagination.limit,
            totalPages: totalPages,
            repositories
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({ error: 'Server error' });
    }
}

const upateRepository = async (req, res) => {
    try {
        const repoID = req.params.id;
        const { title, language, noOfLessons } = req.body;
        const repository = await repoModel.findByIdAndUpdate(repoID, {
            title,
            language,
            noOfLessons
        }, { new: true });

        const validLanguage = await languageModel.findById(language);
        if(!validLanguage){
            return res.status(404).json({ error: 'Language not found' });
        }
        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        res.status(200).json({ message: 'Repository updated successfully', repository });
    } catch (error) {
        console.error('Error updating repository:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteRepository = async (req, res) => {
    try {
        const repoID = req.params.id;
        const deletedRepository = await repoModel.findByIdAndDelete(repoID);
        if (!deletedRepository) {
            return res.status(404).json({ error: 'Repository not found' });
        }
        res.status(200).json({ message: 'Repository deleted successfully', deletedRepository });
    } catch (error) {
        console.error('Error deleting repository:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const searchRepo = async(req,res)=>{
    try{
        const searchTerm = req.params.search;
        const repository = await repoModel.find({ title: { $regex: searchTerm , $options: 'i' } });
        res.status(200).json({ repository });

    }
    catch(error)
    {
        console.log(error);
        return res.status(404).json({ error: 'Server error' });
    }
}

module.exports = { createRepository,getRepositories,upateRepository,deleteRepository,searchRepo };