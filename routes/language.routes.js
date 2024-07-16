const router = require('express').Router();

const { createLanguage,getLanguage,deleteLanguage } = require('../controllers/language.controller');

router.post('/create', createLanguage );
router.get('/getlanguage/:id?',getLanguage);
router.delete('/deletelanguage/:id',deleteLanguage);

module.exports = router