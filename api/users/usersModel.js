const db = require('../../database/db-config');

module.exports = {
    addUser,
    findUserBy,
    findUserById,
    
    getRecipes,
    addRecipe,
    getRecipeById,
    updateRecipe,
    removeRecipe,
    updateRecipePic
}

async function addUser(user) {
    const [id] = await db("users")
    .insert(user, "id");
    return findUserById(id)
}

function findUserBy(filter) {
    return db("users")
    .where(filter);
}

function findUserById(id) {
    return db("users")
    .where({ id })
    .first();
  }

function getRecipes(id) {
    return db("users")
        .join('recipes', 'users.id', 'recipes.user_id')
        .select(
            'recipes.id',
            'users.username',
            'recipes.user_id',
            'recipes.recipeName',
            'recipes.imageURL',
            'recipes.prepTime',
            'recipes.cookTime',
            'recipes.serving',
            'recipes.ingredients',
            'recipes.instructions'
            )
        .where('users.id', id)
}

function addRecipe(newRecipe){
    return db('recipes')
        .insert(newRecipe, 'id')
        .then((id) => {
            console.log(id)
            return db('recipes')
                    .where('id', id[0])
                    .first()
        })
}

function getRecipeById(recipeId){
    return db("users")
    .join('recipes', 'users.id', 'recipes.id')
    .select(
        'recipes.id',
        'users.username',
        'recipes.user_id',
        'recipes.recipeName',
        'recipes.imageURL',
        'recipes.prepTime',
        'recipes.cookTime',
        'recipes.serving',
        'recipes.ingredients',
        'recipes.instructions'
        )
    .where('recipes.id', recipeId)
}

function updateRecipe(changes, recipeId){
    return db('recipes')
        .where('recipes.id', recipeId)
        .update(changes)
        .then(() => {
            return getRecipeById(recipeId)
        })
}

function removeRecipe(recipeId) {
    return db('recipes')
        .where('recipes.id', recipeId)
        .del()
}

function updateRecipePic(changes, recipeId) {
    return db('recipes')
        .where('recipes.id', recipeId)
        .update(changes)
        .then(count => getRecipeById(recipeId));
}