const jobRole = require('../models/jobRole.schema');
const interviewQuesModel = require('../models/interviewQues.schema');

/**
 * @swagger
 * components:
 *   schemas:
 *     JobRole:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the job role.
 *         name:
 *           type: string
 *           description: The name of the job role.
 *       required:
 *         - name
 */

/**
 * @swagger
 * /api/jobroles/create:
 *   post:
 *     summary: Create a new job role
 *     tags: [JobRole]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRole'
 *     responses:
 *       '201':
 *         description: Job Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newJob:
 *                   $ref: '#/components/schemas/JobRole'
 *       '400':
 *         description: Job Role already exists
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
const createJobRole = async (req, res) => {
    try{
        const {name} = req.body;

        const job = await jobRole.findOne({name: name});
        if(job){
            return res.status(400).json({error: 'Job Role already exists'});
        }
        const newJob = new jobRole({name});
        await newJob.save();
        res.status(201).json({message: 'Job Role created successfully', newJob});
    }catch(error){
        console.error('Error creating job role:', error);
        res.status(500).json({error: 'Server error'});
    }
}

/**
 * @swagger
 * /api/jobroles/get/{id}:
 *   get:
 *     summary: Get a job role by ID
 *     tags: [JobRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the job role to get
 *     responses:
 *       '200':
 *         description: Successful response with the job role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRole'
 *       '404':
 *         description: Job Role not found
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
 * /api/jobroles/get:
 *   get:
 *     summary: Get all job roles
 *     tags: [JobRole]
 *     responses:
 *       '200':
 *         description: Successful response with the job roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobRole'
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

const getJobRoles = async (req, res) => {
    try{
        const jobID = req.params.id;
        if(jobID){
            const jobRoles = await jobRole.findById(jobID);
            if(!jobRoles){
                return res.status(404).json({error: 'Job Role not found'});
            }
            return res.status(200).json({jobRoles});
        }
        const jobRoles = await jobRole.find();
        res.status(200).json({jobRoles});
    }catch(error){
        console.error('Error getting job roles:', error);
        res.status(500).json({error: 'Server error'});
    }
}   

/**
 * @swagger
 * /api/jobroles/update/{id}:
 *   put:
 *     summary: Update a job role by ID
 *     tags: [JobRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the job role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobRole'
 *     responses:
 *       '200':
 *         description: Job Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 job:
 *                   $ref: '#/components/schemas/JobRole'
 *       '404':
 *         description: Job Role not found
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
 *                   example: Server error
 */

const updateJobRole = async (req, res) => {
    try{
        const jobID = req.params.id;
        const {name} = req.body;

        const job = await jobRole.findById(jobID);
        if(!job){
            return res.status(404).json({error: 'Job Role not found'});
        }
        const updatedJobRole = await jobRole.findByIdAndUpdate(jobID, {name}, {new: true});
        res.status(200).json({message: 'Job Role updated successfully', updatedJobRole});
    }catch(error){  
        console.error('Error updating job role:', error);
        res.status(500).json({error: 'Server error'});
    }
}

/**
 * @swagger
 * /api/jobroles/delete/{id}:
 *   delete:
 *     summary: Delete a job role by ID
 *     tags: [JobRole]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the job role to delete
 *     responses:
 *       '200':
 *         description: Job Role deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedJob:
 *                   $ref: '#/components/schemas/JobRole'
 *       '404':
 *         description: Job Role not found or related interview question exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 interviewQuestionExists:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The auto-generated ID of the interview question.
 *                     question:
 *                       type: string
 *                       description: The interview question.
 *                     answer:
 *                       type: string
 *                       description: The answer to the interview question.
 *                     jobRole:
 *                       type: string
 *                       description: The ID of the job role associated with the interview question.
 *                     level:
 *                       type: string
 *                       description: The difficulty level of the interview question.
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the interview question was created.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the interview question was last updated.
 *                     __v:
 *                       type: integer
 *                       description: The version key.
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



const deleteJobRole = async (req, res) => {
    try{
        const jobID = req.params.id;

        const job = await jobRole.findById(jobID);
        if(!job){
            return res.status(404).json({error: 'Job Role not found'});
        }
        const interviewQuestionExists = await interviewQuesModel.findOne({jobRole: jobID});
        if(interviewQuestionExists){
            return res.status(404).json({error: 'Cannot delete job role since there is an interview question related', interviewQuestionExists});
        }
        const deletedJob = await jobRole.findByIdAndDelete(jobID);
        res.status(200).json({message: 'Job Role deleted successfully', deletedJob});
    }catch(error){
        console.error('Error deleting job role:', error);
        res.status(500).json({error: 'Server error'});
    }
}

module.exports = {createJobRole, getJobRoles, updateJobRole, deleteJobRole}