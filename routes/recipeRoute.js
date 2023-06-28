const express = require('express');
const router = express.Router();
const {
    newRecipe,
    allRecipe,
    oneRecipe,
    updateRecipe,
    deleteRecipe
} = require('../controllers/recipeController')
const upload = require('../utils/multer');
const validateRecipe = require('../middleware/recipeValidate')



router.post('/recipe', upload.fields([{name: 'recipePicture', maxCount: 10}]), validateRecipe, newRecipe);
router.get('/recipe', allRecipe);
router.get('/recipe/:id', oneRecipe);
router.put('/recipe/:id', upload.fields([{name: 'recipePicture', maxCount: 10}]), validateRecipe, updateRecipe);
router.delete('/recipe/:id', deleteRecipe);


module.exports = router;
// upload.fields( [ {name: 'recipePicture', maxCount: 10} ] )