const Joi = require('@hapi/joi')

const validateRecipe = (req, res, next)=>{
    const schema = Joi.object({
        recipeName: Joi.string().required(),
        recipeDescription: Joi.string().required(),
        recipeNumber: Joi.string().pattern(/^[0-9]{5}$/).required(),
        recipeIngredients: Joi.string().required(),
        // recipePicture: Joi.string().required(),
    })
    const {error} = schema.validate(req.body);
    if(error) {
        const validateError = error.details.map((detail)=>detail.message);
        res.status(409).json({
            message: validateError
        })
    } else {
        next()
    }
}

module.exports = validateRecipe