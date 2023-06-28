const recipeModel = require('../models/recipeModel');
const cloudinary = require('../utils/cloudinary')
const fs = require('fs');
const path=require('path');



// const newRecipe = async (req, res)=>{
    
//     try {
//         const { recipeName, recipeDescription, recipeNumber, recipeIngredients } = req.body;
//         // console.log(req.files.recipePicture)
//         const recipe = req.files.recipePicture
//         let resArray = [];
//         for(
//             const element of recipe 
//         ){
//             const resUpload = await cloudinary.uploader.upload(element.path)
//             console.log(resUpload)
//             resArray.push(resUpload.secure_url)
//         };
//         // const result = await cloudinary.uploader.upload(req.files.recipePicture.path)
//         const newRes = new recipeModel({
//             recipeName,
//             recipeDescription,
//             recipeNumber,
//             recipeIngredients,
//             recipePicture: resArray
//         })

//         // await fs.unlinkSync(req.file.path)
//         const savedRes = await newRes.save();
//         if(savedRes) {
//             res.status(201).json({
//                 message: 'New Recipe saved successfully',
//                 data: savedRes
//             })
//         } else {
//             res.status(404).json({
//                 message: 'Unable to create new Recipe'
//             })
//         }
            
//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// }



const newRecipe = async (req, res)=>{
    
    try {
        const { recipeName, recipeDescription, recipeNumber, recipeIngredients } = req.body;
        const pictureFiles = req.files['recipePicture'];

        const uploadedPictures = await Promise.all(
        pictureFiles.map(file =>
            new Promise((resolve, reject) => {
            cloudinary.uploader.upload(file.path, { folder: 'recipe_pictures' }, (error, result) => {
                if (error) {
                    console.error('Error uploading picture:', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            });
            })
        )
        );
        const newRes = new recipeModel({
            recipeName,
            recipeDescription,
            recipeNumber,
            recipeIngredients,
            recipePicture: await uploadedPictures
        })
        // console.log(uploadedPictures)
        // fs.unlinkSync(req.file.path)
        const savedRes = await newRes.save();
        if(savedRes) {
            res.status(201).json({
                message: 'New Recipe saved successfully',
                data: savedRes
            })
        } else {
            res.status(404).json({
                message: 'Unable to create new Recipe'
            })
        }
    
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}







const allRecipe = async (req, res)=>{
    try {
        const recipes = await recipeModel.find();
        if (recipes.length === 0) {
            res.status(404).json({
                message: 'No recipes found'
            });
        } else {
            res.status(200).json({
                message: 'Recipes Found',
                data: recipes
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const oneRecipe = async (req, res)=>{
    try {
        const recipeId = req.params.id;
        const recipe = await recipeModel.findById(recipeId);
        if (!recipe) {
            res.status(404).json({
                message: 'Recipe not found'
            });
        } else {
            res.status(200).json({
                message: 'Recipe found',
                data: recipe
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const updateRecipe = async (req, res)=>{
    try {
        const recipeId = req.params.id;
        const recipe = await recipeModel.findById(recipeId);
        const { recipeName, recipeDescription, recipeNumber, recipeIngredients } = req.body;
        const pictureFiles = req.files['recipePicture'];
        if (!recipe) {
            res.status(404).json({
                message: 'Recipe not found'
            })
        } else {
            // console.log(recipe)
            const newRecipe = await new recipeModel ({ recipeName: recipeName || recipe.recipeName,
            recipeDescription: recipeDescription || recipe.recipeDescription,
            recipeNumber: recipeNumber || recipe.recipeNumber,
            recipeIngredients: recipeIngredients || recipe.recipeIngredients, 
            recipePicture: recipe.recipePicture
            })
            
            if (pictureFiles && pictureFiles.length > 0) {
                // https://res.cloudinary.com/do2cowrhb/image/upload/v1687896991/hg1npoeuz4j8sqi1137e.jpg
                console.log(recipe.recipePicture.map(url => url.split('/').pop().split('.')[0]))
                const recipeCloudId = recipe.recipePicture.map(url => url.split('/').pop().split('.')[0]);
                await cloudinary.uploader.destroy(recipeCloudId);
                const uploadedPictures = await Promise.all(
                    pictureFiles.map(file =>
                      new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(file.path, { folder: 'recipe_pictures' }, (error, result) => {
                          if (error) {
                            console.error('Error uploading picture:', error);
                            reject(error);
                          } else {
                            resolve(result.secure_url);
                          }
                        });
                      })
                    )
                );
                newRecipe.recipePicture = uploadedPictures
            }
            // newRecipe.recipePicture = uploadedPictures;
            const updatedRecipe = await newRecipe.save();
            if (!updatedRecipe) {
                res.status(400).json({
                    message: 'Can not Update Recipe'
                })
            } else {
                res.status(200).json({
                    message: 'Recipe Updated Successfully',
                    data: updatedRecipe
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const deleteRecipe = async (req, res)=>{
    try {
        const recipeId = req.params.id;
        const recipe = await recipeModel.findById(recipeId);
        if (recipe) {
            if (recipe.recipePicture) {
                console.log(recipe.recipePicture.map(url => url.split('/').pop().split('.')[0]).toString());
                const recipeCloudId = recipe.recipePicture.map(url => url.split('/').pop().split('.')[0]).toString();
                await cloudinary.uploader.destroy(recipeCloudId);
            }
            const deletedRecipe = await recipeModel.findByIdAndDelete(recipeId);
            res.status(200).json({
                message: 'Recipe deleted',
                data: recipe
            })
        } else {
            res.status(404).json({
                message: 'Recipe not found'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


module.exports = {
    newRecipe,
    allRecipe,
    oneRecipe,
    updateRecipe,
    deleteRecipe
}