const jobRole = require('../models/jobRole.schema');
const interviewQuesModel = require('../models/interviewQues.schema');
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

const updateJobRole = async (req, res) => {
    try{
        const jobID = req.params.id;
        const {name} = req.body;

        const job = await jobRole.findById(jobID);
        if(!job){
            return res.status(404).json({error: 'Job Role not found'});
        }
        const update = await jobRole.findByIdAndUpdate(jobID, {name}, {new: true});
        res.status(200).json({message: 'Job Role updated successfully', job});
    }catch(error){  
        console.error('Error updating job role:', error);
        res.status(500).json({error: 'Server error'});
    }
}

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