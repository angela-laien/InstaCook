const router = require("express").Router();
const Recipes = require('./recipesModel.js');

// router.get('/', (req, res) => {
//     Recipes.getRecipes()
//     .then(recipes => {
//     res.status(200).json(recipes)
//   })
//     .catch(err => res.status(500).json({ message: 'Failed to get recipes.'}))
//   });

router.put('/:id',(req, res) => {
  const {id} = req.params;
  const changes = req.body;

  Recipes.findById(id)
    .then(recipe => {
      if(recipe) {
        Recipes.update(changes, id)
        .then(updatedRecipe => {
          res.json(updatedRecipe);
        });
      } else {
        res.status(404).json({ message: 'Could not find recipe with given id'})
      }
    })
    .catch (err => {
      res.status(500).json({message: 'Failed to update recipe'})
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Recipes.remove(id)
  .then(deleted => {
    if (deleted) {
      res.json({ removed: deleted });
    } else {
      res.status(404).json({ message: 'Could not find recipe with given id' });
    }
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to delete recipe' });
  });
});

module.exports = router;