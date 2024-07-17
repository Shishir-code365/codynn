const interviewQuesModel = require('../models/interviewQues.schema')
const jobRoleModel = require('../models/jobRole.schema')

/**
 * @swagger
 * components:
 *   schemas:
 *     InterviewQuestion:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the question.
 *         question:
 *           type: string
 *           description: The question text.
 *         answer:
 *           type: string
 *           description: The answer to the question.
 *         jobRole:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The ID of the associated job role.
 *             name:
 *               type: string
 *               description: The name of the associated job role.
 *           description: The job role associated with the question.
 *         level:
 *           type: string
 *           enum:
 *             - Internship
 *             - Junior Level
 *             - Mid Level
 *             - Senior Level
 *           description: The level of the question.
 *       required:
 *         - question
 *         - answer
 *         - jobRole
 *         - level
 */

/**
 * @swagger
 * /api/interviewQuestions/create:
 *   post:
 *     summary: Create a new question
 *     tags: [InterviewQuestion]
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
 *             $ref: '#/components/schemas/InterviewQuestion'
 *     responses:
 *       '201':
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newQuestion:
 *                   $ref: '#/components/schemas/InterviewQuestion'
 *                 totalQuestions:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       '400':
 *         description: Invalid job role or other client error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
const createQuestions = async(req,res)=>{
    try{
        const MAX_REPOSITORIES_PER_PAGE = parseInt(req.query.limit);
        const {question, answer, jobRole, level} = req.body;
        const checkRole = await jobRoleModel.findOne({_id: jobRole});
        if(!checkRole){
            return res.status(400).json({error: 'Invalid job role'});
        }
        const newQuestion = new interviewQuesModel({question, answer, jobRole, level});
        await newQuestion.save();

        const totalQuestions = await interviewQuesModel.countDocuments();
        const totalPages = Math.ceil(totalQuestions / MAX_REPOSITORIES_PER_PAGE);

        return res.status(201).json({message: 'Question created successfully', newQuestion, totalQuestions,totalPages});

    }catch(error){
        console.log(error);
        return res.status(404).json({error: 'Server error'});
    }
}

/**
 * @swagger
 * /api/interviewQuestions/get/{id}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [InterviewQuestion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question to get
 *     responses:
 *       '200':
 *         description: Successful response with the question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterviewQuestion'
 *       '404':
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Question not found
 */

/**
 * @swagger
 * /api/interviewQuestions/get:
 *   get:
 *     summary: Get all questions with pagination
 *     tags: [InterviewQuestion]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: Maximum number of questions per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page number
 *     responses:
 *       '200':
 *         description: Successful response with paginated questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InterviewQuestion'
 */

const getQuestions = async(req,res)=>{
    try{
        const questionID = req.params.id;
        if(questionID){
            const question = await interviewQuesModel.findById(questionID).populate('jobRole');
            if(!question){
                return res.status(404).json({error: 'Question not found'});
            }
            return res.status(200).json({question});
        }

        const MAX_QUESTIONS_PER_PAGE = parseInt(req.query.limit);
        const { startIndex, limit } = req.pagination;

        const questions = await interviewQuesModel.find()
        .populate('jobRole')
        .limit(limit)
        .skip(startIndex);
        const totalQuestions = await interviewQuesModel.countDocuments();
        const totalPages = Math.ceil(totalQuestions / MAX_QUESTIONS_PER_PAGE);
        return res.status(200).json({total: totalQuestions, page: req.pagination.page, limit: req.pagination.limit, totalPages: totalPages, questions});


    }catch(error){
        console.log(error);
        return res.status(404).json({error: 'Server error'});
    }
}


/**
 * @swagger
 * /api/interviewQuestions/update/{id}:
 *   put:
 *     summary: Update a question by ID
 *     tags: [InterviewQuestion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterviewQuestion'
 *     responses:
 *       '200':
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedQuestion:
 *                   $ref: '#/components/schemas/InterviewQuestion'
 *       '400':
 *         description: Invalid job role or other client error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '404':
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

const updateQuestions = async(req,res)=>{
    try{
        const questionID = req.params.id;
        const {question, answer, jobRole, level} = req.body;

        if(jobRole){
            const checkRole = await jobRoleModel.findOne({_id: jobRole});
            if(!checkRole){
                return res.status(400).json({error: 'Invalid job role'});
            }

        }
       

        const updatedQuestion = await interviewQuesModel.findByIdAndUpdate(req.params.id,req.body, {new: true});
        if(!updatedQuestion){
            return res.status(404).json({error: 'Question not found'});
        }
        return res.status(200).json({message: 'Question updated successfully', updatedQuestion});
    }catch(error){
        console.log(error);
        return res.status(404).json({error: 'Server error'});
    }
}

/**
 * @swagger
 * /api/interviewQuestions/delete/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     tags: [InterviewQuestion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the question to delete
 *     responses:
 *       '200':
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedQuestion:
 *                   $ref: '#/components/schemas/InterviewQuestion'
 *       '404':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

const deleteQuestions = async(req,res)=>{
    try{
        const questionID = req.params.id;
        const deletedQuestion = await interviewQuesModel.findByIdAndDelete(questionID);
        if(!deletedQuestion){
            return res.status(404).json({error: 'Question not found'});
        }
        return res.status(200).json({message: 'Question deleted successfully', deletedQuestion});
    }
    catch(error){
        console.log(error);
        return res.status(404).json({error: 'Server error'});
    }
}

/**
 * @swagger
 * /api/interviewQuestions/search/{searchTerm}:
 *   get:
 *     summary: Search questions by title
 *     tags: [InterviewQuestion]
 *     parameters:
 *       - in: path
 *         name: searchTerm
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term to find questions by title
 *     responses:
 *       '200':
 *         description: Successful response with found questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InterviewQuestion'
 *       '404':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error searching questions
 */

const searchQuestions = async (req, res) => {
    try {
        const searchTerm = req.params.search;
        const question = await interviewQuesModel.find({ question: { $regex: searchTerm, $options: 'i' } });
        res.status(200).json({ question });
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = {createQuestions,getQuestions,updateQuestions,deleteQuestions,searchQuestions}