const interviewQuesModel = require('../models/interviewQues.schema')
const jobRoleModel = require('../models/jobRole.schema')
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

const searchQuestions = async (req, res) => {
    try {
        const question = await interviewQuesModel.find({ question: { $regex: req.body.search, $options: 'i' } });
        res.status(200).json({ question });
    } catch (error) {
        console.error('Error searching questions:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = {createQuestions,getQuestions,updateQuestions,deleteQuestions,searchQuestions}