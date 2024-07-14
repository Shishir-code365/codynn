const LanguageModel = require('../models/language.schema');
const VideoModel = require('../models/video.schema');
const repositoryModel = require('../models/repository.schema');

const createLanguage = async (req, res) => {
    try {
        const { languageType, languageExtension, appIcon, applicationName, appStoreLink, bannerImage, description, playstoreLink, images, qrImage, features } = req.body;

        const languageExists = await LanguageModel.findOne({ languageType });
        if (languageExists) {
            return res.status(400).json({ error: 'Language already exists' });
        }


        const language = new LanguageModel({
            languageType,
            languageExtension,
            appIcon,
            applicationName,
            appStoreLink,
            bannerImage,
            description,
            playstoreLink,
            images,
            qrImage,
            features
        });

        await language.save();

        res.status(201).json({ message: 'Language created successfully', language });

    } catch (error) {
        console.error('Error creating language:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


const getLanguage = async (req, res) => {
    try{

        const languageID = req.params.id;
        if(!languageID){
            const getAllLanguages = await LanguageModel.find();
            if(!getAllLanguages){
                return res.status(404).json({success:false,message:"There are no languages"})
            }
            return res.status(201).json({success:true,message:"Successfully fetched languages",getAllLanguages})
        }
        const languagebyID = await LanguageModel.findById(languageID);
        if(!languagebyID)
        {
            return res.status(404).json({success:false,message:"No language found with that id"})
        }
        return res.status(201).json({success:true,message:"Successfully fetched language",languagebyID})   
    }
    catch(error){
        console.error('Error fetching language:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const deleteLanguage = async (req, res) => {
    try {
        const languageID = req.params.id;

        const languageExistsInVideo = await VideoModel.findOne({ language: languageID });
        if (languageExistsInVideo) {
            return res.status(404).json({ message: 'Cannot Delete language since there is a video related' });
        }

        const languageExistsInRepository = await repositoryModel.findOne({ language: languageID });
        if (languageExistsInRepository) {
            return res.status(404).json({ message: 'Cannot Delete language since there is a Repository related' });
        }
        
        const deletedLanguage = await LanguageModel.findByIdAndDelete(languageID);
        if (!deletedLanguage) {
            return res.status(404).json({ error: 'Language not found' });
        }
        res.status(200).json({ message: 'Language deleted successfully', deletedLanguage });
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createLanguage, getLanguage, deleteLanguage };