const documentationModel = require('../models/documentation.schema');
const createDocumentation = async(req,res)=>{
    try{
        const MAX_DOCUMENTATION_PER_PAGE = parseInt(req.query.limit);
        const findDoc = await documentationModel.findOne({title: req.body.title});
        if(findDoc){
            return res.status(400).json({error: 'Documentation already exists'});
        }
        const newDocumentation = await new documentationModel({
        ...req.body
         }).save();

    const totalDocumentations = await documentationModel.countDocuments();
    const totalPages = Math.ceil(totalDocumentations / MAX_DOCUMENTATION_PER_PAGE);

    return res.status(200).json({
        success: true,
        message: "Documentation created successfully",
        newDocumentation,
        totalDocumentations,
        totalPages
    })
    }
    catch(error)
    {
        console.log(error);
        return res.status(404).json("Error")
    }
}

const getDocumentation = async(req,res)=>{
    try{
        const docID = req.params.id;
        if(docID){
            const documentation = await documentationModel.findById(docID);
            if(!documentation){
                return res.status(404).json({error: 'Documentation not found'});
            }
            return res.status(200).json({documentation});
        }

        const {startIndex, limit} = req.pagination;

        const documentation = await documentationModel.find()
        .limit(limit)
        .skip(startIndex);
        const totalDocumentations = await documentationModel.countDocuments();
        const totalPages = Math.ceil(totalDocumentations / limit);
        res.status(200).json({documentation, totalDocumentations, totalPages});
    }
    catch(error)
    {
        console.log(error);
        return res.status(404).json("Error")
    }
}
const sortDocumentation = async(req,res)=>{
    
    try{
        const sortBy = req.query.sortBy;
        let sortedDocumentations;
        if(sortBy === 'popularity'){

            sortedDocumentations = await documentationModel.find().sort({popularity: -1});
            res.status(200).json({sortedDocumentations});
        }
        else if (sortBy === 'alphabetical'){

            sortedDocumentations = await documentationModel.find().sort({title: 1});
            res.status(200).json({sortedDocumentations});
        }
        else{
            const Documentations = await documentationModel.find();
            res.status(200).json({Documentations});
        }
       
    }
    catch(error)    
    {
        console.log(error);
        return res.status(404).json("Error")
    }
}

const updateDocumentation = async(req,res)=>{
    try{
        const docID = req.params.id;
        const {title,popularity,content} = req.body
        const updatedDoc = await documentationModel.findByIdAndUpdate(docID, req.body, {new: true});
        if(!updatedDoc){
            return res.status(404).json({error: 'Documentation not found'});
        }   
        return res.status(200).json({message: 'Documentation updated successfully', updatedDoc});
    }
    catch(error)
    {
        console.log(error);
        return res.status(404).json("Error")
    }
}

const deleteDocumentation = async(req,res)=>{
    try{
        const docID = req.params.id;
        const deletedDoc = await documentationModel.findByIdAndDelete(docID);
        if(!deletedDoc){
            return res.status(404).json({error: 'Documentation not found'});
        }
        return res.status(200).json({message: 'Documentation deleted successfully', deletedDoc});
    }
    catch(error)
    {
        console.log(error);
        return res.status(404).json("Error")
    }
}
module.exports = {createDocumentation,getDocumentation,sortDocumentation, updateDocumentation,deleteDocumentation}