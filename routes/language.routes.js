const router = require('express').Router();

const { createLanguage,getLanguage,deleteLanguage,updateLanguage } = require('../controllers/language.controller');

router.post('/create', createLanguage );
router.get('/getlanguage/:id?',getLanguage);
router.delete('/deletelanguage/:id',deleteLanguage);
router.put('/updatelanguage/:id',updateLanguage);

module.exports = router