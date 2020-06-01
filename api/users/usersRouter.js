const router = require("express").Router();

const Users = require('./usersModel.js');

const cloudinary = require('cloudinary').v2;

//gets users recipes
router.get("/:id/recipes", (req, res) => {
    console.log("token", req.decodedToken);
    const { id } = req.params;

    Users.getRecipes(id)
        .then(recipes => {
            if (recipes.length) {
            res.json(recipes);
            } else {
            res.status(404).json({ 
                message: 'Could not find recipes for given user'
             })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Failed to get recipes' });
        });
});

//add recipe
router.post('/:id/recipes', (req, res) => {
    const { id } = req.params;
    const newRecipe = req.body;
    console.log(newRecipe);
    newRecipe.user_id = id;

    Users.addRecipe(newRecipe, id)
        .then(recipes => {
            res.status(200).json(recipes)
        })
        .catch(err => res.status(401).json({ message: 'error adding recipe.', err}))
});

//finds specific recipe
// router.get('/:id/recipes/:recipeId', (req, res) => {
//     const { id, recipeId } = req.params;

//     Users.getRecipes(id)
//         .then(recipes => {
//             !recipes[0]
//             ?res.status(400).json({ message: 'no recipes have been created for this user.'})
//             :Users.getRecipeById(recipeId)
//             .then(recipe =>{
//                 !recipe[0]
//                 ?res.status(400).json({ message: 'that recipeId does not exist for this user.'})
//                 :res.status(200).json(recipe)
//             })
//             .catch(err => res.status(400).json({ message: 'could not find that recipe.'}))
//         })
//         .catch(err => res.status(500).json({ message: 'error getting recipe.'}))
// });

//updates recipe
// router.put('/:id/recipes/:recipeId', (req, res) => {
//     const { id, recipeId } = req.params;
//     const changes = req.body;

//     Users.getRecipeById(recipeId)
//         .then(recipe => {
//             console.log('res: ', recipe)
//             if(!recipe[0]){
//                 res.status(400).json({ message: 'that recipe does not exist.' })
//             }
//             Users.updateRecipe(changes, recipeId)
//             .then(update => {
//                 console.log(update)
//                 res.status(201).json({ message: 'update success!', update})
//             })
//             .catch(err => res.status(400).json({ message: 'error updating that recipe.' }))
//         })
//         .catch(err => res.status(400).json({ message: 'error finding that recipe.', err}))
// })

// // delete recipe
// router.delete('/:id/recipes/:recipeId', (req, res) => {
//     const { id, recipeId } = req.params;
  
//     Users.getRecipeById(recipeId)
//       .then(recipe => {
//         if (recipe.length == 0) {
//           res.status(400).json({ message: 'that recipe does not exist.' })
//         }
//         Users.removeRecipe(recipeId)
//         .then(deleted => {
//             res.status(201).json({ message: 'deleted successfully!', deleted })
//         })
//         .catch(err => {
//             console.log('delete err: ', err)
//             res.status(400).json({ message: 'error deleting the recipe.', err })
//         })
//       })
//       .catch(err => res.status(400).json({ message: 'error finding that recipe.', err }))
// })

// update recipe image

cloudinary.config({
    cloud_name: 'imagevideo',
    api_key: '312561633271293',
    api_secret: 'hnbjjHVnNfC0RVXUJrCvy5u9NLc',
});

router.put('/:id/recipes/:recipeId/image', (req, res) => {
    const file = req.files.photo;
    const recipeId = req.params.recipeId;

    console.log('file', file, 'recipeId', recipeId);

    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        Users.updateRecipePic({ imageURL: result.url }, recipeId)
            .then(output => {
                res.json({ success: true, result });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: 'Error uploading to Cloudinary' });
            });
    });
    
});

module.exports = router;