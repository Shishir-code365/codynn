const documentationModel = require('../models/documentation.schema');
const { search } = require('../routes/video.routes');
/**
 * @swagger
 *  components:
 *   schemas:
 *     Documentation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: array
 *           items:
 *             type: string
 *         popularity:
 *           type: number
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */
/**
 * @swagger
 * /api/documentation/create:
 *     post:
 *       summary: Create new documentation
 *       tags: [Documentation]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: array
 *                   items:
 *                     type: string
 *                 popularity:
 *                   type: number
 *       parameters:
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: Maximum number of documentations per page
 *       responses:
 *         '200':
 *           description: Documentation created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: Documentation created successfully
 *                   newDocumentation:
 *                     $ref: '#/components/schemas/Documentation'
 *                   totalDocumentations:
 *                     type: integer
 *                     example: 10
 *                   totalPages:
 *                     type: integer
 *                     example: 2
 *         '400':
 *           description: Documentation already exists
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Documentation already exists
 *         '404':
 *           description: Error
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: Error
 */
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

/**
 * @swagger
 * /api/documentation/get/{id}:
 *   get:
 *     summary: Get documentation by ID
 *     tags: [Documentation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The documentation ID
 *     responses:
 *       '200':
 *         description: Successful response with documentation data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documentation:
 *                   $ref: '#/components/schemas/Documentation'
 *       '404':
 *         description: Documentation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 * 
 * /api/documentation/get:
 *   get:
 *     summary: Get all documentations with pagination
 *     tags: [Documentation]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of documentations per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by criteria (popularity, alphabetical)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for documentation titles
 *     responses:
 *       '200':
 *         description: Successful response with paginated documentation data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Documentation'
 *                 totalDocumentations:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
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
        const {sortBy,search,page, limit} = req.query;
        let query = {};

        let sortOptions = {};
        if (sortBy) {
            if (sortBy === 'popularity') {
                sortOptions.popularity = -1;
            } else if (sortBy === 'alphabetical') {
                sortOptions.title = 1;
            }
        }
        if(search)
        {
            query.title = { $regex: search, $options: 'i' };
        }
        if(Object.keys(query).length === 0)
        {
            query = {};
        }
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 6,
            sort: sortOptions
        }

        const documents = await documentationModel.paginate(query,options)

        return res.status(200).json({documents})
    }
    catch(error)
    {
        console.log(error);
        return res.status(404).json("Error")
    }
}

/**
 * @swagger
 * /api/documentation/update/{id}:
 *   put:
 *     summary: Update documentation by ID
 *     tags: [Documentation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The documentation ID
 *       - in: body
 *         name: body
 *         description: Fields for the documentation to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Updated Title"
 *             content:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Updated content line 1", "Updated content line 2"]
 *             popularity:
 *               type: number
 *               example: 5
 *     responses:
 *       '200':
 *         description: Documentation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Documentation updated successfully
 *                 updatedDoc:
 *                   $ref: '#/components/schemas/Documentation'
 *       '404':
 *         description: Documentation not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Documentation not found
 *       '400':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error
 */


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

/**
 * @swagger
 * /api/documentation/delete/{id}:
 *   delete:
 *     summary: Delete documentation by ID
 *     tags: [Documentation]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The documentation ID
 *     responses:
 *       '200':
 *         description: Documentation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedDoc:
 *                   $ref: '#/components/schemas/Documentation'
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


module.exports = {createDocumentation,getDocumentation, updateDocumentation,deleteDocumentation}