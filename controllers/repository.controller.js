const repoModel = require('../models/repository.schema');
const languageModel = require('../models/language.schema');

/**
 * @swagger
 * components:
 *   schemas:
 *     Repository:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the repository.
 *         title:
 *           type: string
 *           description: The title of the repository.
 *         language:
 *           type: string
 *           description: The ID of the language associated with the repository.
 *         noOfLessons:
 *           type: number
 *           description: The number of lessons in the repository.
 *         createdAt:
 *           type: string
 *           description: The date and time when the repository was created.
 *         updatedAt:
 *           type: string
 *           description: The date and time when the repository was last updated.
 *       required:
 *         - title
 *         - language
 *         - noOfLessons
 */

/**
 * @swagger
 * /api/repositories/create:
 *   post:
 *     summary: Create a new repository
 *     tags: [Repository]
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
 *             $ref: '#/components/schemas/Repository'
 *     responses:
 *       '201':
 *         description: Repository created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 repository:
 *                   $ref: '#/components/schemas/Repository'
 *                 totalRepositories:
 *                   type: number
 *                 totalPages:
 *                   type: number
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

/**
 * @swagger
 * /api/repositories/get/{id}:
 *   get:
 *     summary: Get a repository by ID
 *     tags: [Repository]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         description: Successful response with the repository
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Repository'
 *       '404':
 *         description: Repository not found
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

/**
 * @swagger
 * /api/repositories/get:
 *   get:
 *     summary: Get all repositories with pagination
 *     tags: [Repository]   
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number.
 *     responses:
 *       '200':
 *         description: Successful response with all repositories
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
 *                 repositories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Repository'
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


/**
 * @swagger
 * /api/repositories/update/{id}:
 *   put:
 *     summary: Update a repository by ID
 *     tags: [Repository]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the repository to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repository'
 *     responses:
 *       '200':
 *         description: Repository updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 repository:
 *                   $ref: '#/components/schemas/Repository'
 *       '404':
 *         description: Repository not found or Language not found
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

/**
 * @swagger
 * /api/repositories/delete/{id}:
 *   delete:
 *     summary: Delete a repository by ID
 *     tags: [Repository]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the repository to delete
 *     responses:
 *       '200':
 *         description: Repository deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedRepository:
 *                   $ref: '#/components/schemas/Repository'
 *       '404':
 *         description: Repository not found
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

/**
 * @swagger
 * /api/repositories/search/{search}:
 *   get:
 *     summary: Search repositories by title
 *     tags: [Repository]
 *     parameters:
 *       - in: path
 *         name: search
 *         schema:
 *           type: string
 *         required: true
 *         description: The search term for the repository title
 *     responses:
 *       '200':
 *         description: Successful response with matching repositories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Repository'
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