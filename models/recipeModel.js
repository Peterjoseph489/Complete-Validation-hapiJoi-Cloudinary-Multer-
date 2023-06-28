const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    recipeDescription: {
        type: String,
        required: true
    },
    recipeNumber: {
        type: String,
        required: true
    },
    recipeIngredients: {
        type: Array,
        required: true
    },
    recipePicture: {
        type: Array,
        required: true
    }
})

const recipeModel = mongoose.model('recipes', recipeSchema);

module.exports = recipeModel