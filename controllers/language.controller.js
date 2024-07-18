const LanguageModel = require('../models/language.schema');
const VideoModel = require('../models/video.schema');
const repoModel = require('../models/repository.schema');


/**
 * @swagger
 * components:
 *   schemas:
 *     Language:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the language.
 *         languageType:
 *           type: string
 *           description: The type of the language.
 *         languageExtension:
 *           type: string
 *           description: The file extension associated with the language.
 *         appIcon:
 *           type: string
 *           description: The URL of the application icon.
 *         applicationName:
 *           type: string
 *           description: The name of the application.
 *         appStoreLink:
 *           type: string
 *           description: The URL link to the application on the App Store.
 *         bannerImage:
 *           type: string
 *           description: The URL of the banner image.
 *         description:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of descriptions for the language.
 *         playstoreLink:
 *           type: string
 *           description: The URL link to the application on the Play Store.
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of image URLs associated with the language.
 *         qrImage:
 *           type: string
 *           description: The URL of the QR image.
 *         features:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               featureTitle:
 *                 type: string
 *                 description: The title of the feature.
 *               featureDescription:
 *                 type: string
 *                 description: The description of the feature.
 *       required:
 *         - languageType
 *         - appIcon
 *         - applicationName
 *         - description
 *         - images
 *         - features
 */


/**
 * @swagger
 * /api/languages/create:
 *   post:
 *     summary: Create a new language
 *     tags: [Language]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       '201':
 *         description: Language created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 language:
 *                   $ref: '#/components/schemas/Language'
 *       '400':
 *         description: Language already exists
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

/**
 * @swagger
 * /api/languages/getlanguage/{id}:
 *   get:
 *     summary: Get a language by ID
 *     tags: [Language]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the language to get
 *     responses:
 *       '200':
 *         description: Successful response with the language
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 *       '404':
 *         description: No language found with that ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
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
 * /api/languages/getlanguage:
 *   get:
 *     summary: Get all languages
 *     tags: [Language]
 *     responses:
 *       '200':
 *         description: Successful response with all languages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 getAllLanguages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Language'
 *       '404':
 *         description: No languages found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
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

/**
 * @swagger
 * /api/languages/deletelanguage/{id}:
 *   delete:
 *     summary: Delete a language by ID
 *     tags: [Language]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the language to delete
 *     responses:
 *       '200':
 *         description: Language deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedLanguage:
 *                   $ref: '#/components/schemas/Language'
 *       '404':
 *         description: Language not found or cannot delete due to related videos or repositories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
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

const deleteLanguage = async (req, res) => {
    try {
        const languageID = req.params.id;

        const languageExistsInVideo = await VideoModel.findOne({ language: languageID });
        if (languageExistsInVideo) {
            return res.status(404).json({ message: 'Cannot Delete language since there is a video related' });
        }

        const languageExistsInRepo = await repoModel.findOne({ language: languageID });
        if (languageExistsInRepo) {
            return res.status(404).json({ message: 'Cannot Delete language since there is an repo related' });
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

/**
 * @swagger
 * /api/languages/updatelanguage/{id}:
 *   put:
 *     summary: Update a language by ID
 *     tags: [Language]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the language to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       '200':
 *         description: Language updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedLanguage:
 *                   $ref: '#/components/schemas/Language'
 *       '404':
 *         description: Language not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
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

const updateLanguage = async (req, res) => {
    try{
        const languageID = req.params.id;
        const findLanguage = await LanguageModel.findById(languageID);
        if(!findLanguage){
            return res.status(404).json({success:false,message:"No language found with that id"})
        }
        const updatedLanguage = await LanguageModel.findByIdAndUpdate(languageID, req.body, { new: true });
        res.status(200).json({success:true,message:"Successfully updated language",updatedLanguage})
    }
    catch(error){
        console.error('Error updating language:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { createLanguage, getLanguage, deleteLanguage, updateLanguage };