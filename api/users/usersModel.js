const db = require('../../database/db-config');
const {v4: uuidv4} = require('uuid');

module.exports = {
    addUser,
    findUserBy,
    findUserById,

    getRecipes,
    addRecipe,
    getRecipeById,
    updateRecipe,
    removeRecipe,
    updateRecipePic,

    findRecipeSteps,
    findStepById,
    addRecipeStep,
    updateRecipeStep,
    removeRecipeStep,

    findRecipeIngredientsByRecipeId,
    addRecipeIngredient,
    removeRecipeIngredient
}

async function addUser(user) {
    const [id] = await db("users")
    .insert(user, "id");
    return findUserById(id)
};

function findUserBy(filter) {
    return db("users")
    .where(filter);
};

function findUserById(id) {
    return db("users")
    .where({ id })
    .first();
};

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
            // 'recipes.ingredients',
            // 'recipes.instructions'
            )
        .where('users.id', id)
};

function addRecipe(newRecipe){
    return db('recipes')
        .insert(newRecipe, 'id')
        .then((id) => {
            console.log(id)
            return db('recipes')
                    .where('id', id[0])
                    .first()
        })
};

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
        // 'recipes.ingredients',
        // 'recipes.instructions'
        )
    .where('recipes.id', recipeId)
};

function updateRecipe(changes, recipeId){
    return db('recipes')
        .where('recipes.id', recipeId)
        .update(changes)
        .then(() => {
            return getRecipeById(recipeId)
        })
};

function removeRecipe(recipeId) {
    return db('recipes')
        .where('recipes.id', recipeId)
        .del()
};

function updateRecipePic(changes, recipeId) {
    return db('recipes')
        .where('recipes.id', recipeId)
        .update(changes)
        .then(count => getRecipeById(recipeId));
};

async function findStepById(stepId) {
    const steps = await db('steps')
    .where('id', stepId)
    return steps
};

async function findRecipeSteps(recipeId) {
    const steps = await db('step')
    .where('recipeId', recipeId)
    return steps
};

async function addRecipeStep(stepData) {
    const id = await db('steps').insert({
        id: stepData.recipeId,
        recipeId: stepData.recipeId,
        number: stepData.number,
        instruction: stepData.instruction
    }).returning('id')
    return findRecipeSteps(stepData.recipeId)
};

async function updateRecipeStep(stepData){
    const result = await db('steps')
        .where({
            id: stepData.id,
            recipeId: stepData.recipeId
        })
        .update({
            number: stepData.number,
            instruction: stepData.instruction
        }).returning('id')
        return findRecipeSteps(stepData.recipeId)
};

function removeRecipeStep(stepId){
    return db('steps')
        .where('id', stepId)
        .del()
};

async function findIngredientNameByIngredientId(ingredientId) {
    const ingredient = await db('ingredients').where('id', ingredientId).first()
    const { ingredientName } = ingredient
    return ingredientName
};

async function findIngredientDataByMidId(midId) {
    let ingredient = {}
    const data = await db('recipe_ingredients').where('id', midId).first()

    ingredient.recipe_ingredientsId = data.id,
    ingredient.ingredientId = data.ingredientId,
    ingredient.recipeId = data.recipeId,
    ingredient.ingredientName = await findIngredientNameByIngredientId(data.ingredientId)
    ingredient.amount = data.amount
    return ingredient
}

async function findRecipeIngredientsByRecipeId(recipeId) {
    let ingredientList = []
    const mids = await db('recipe_ingredients').where({ recipeId })
    
    for(let i = 0; i < mids.length; i++) {
        let ingredient = await findIngredientDataByMidId(mids[i].id)
        ingredientList.push(ingredient)
    }
    return ingredientList
};

async function handleBothIds(foundIngredient, foundMid) {
    let mid = await db('recipe_ingredients').where({ id: foundMid.id }).first()
    let ingredient = {
        ...foundIngredient,
        amount: mid.amount,
        midId: mid.id,
        recipeId: mid.recipeId
    }
    return 'This ingredient is already existed in the recipe.'
};

async function handleOneId(foundIngredient, ingredientData) {
    let newMidId = uuidv4()
    let midId = await db('recipe_ingredients')
    .insert({
        id: midId,
        recipeId: ingredientData.recipeId,
        ingredientId: foundIngredient.id,
        amount: ingredientData.amount
    }).returning('id')
    
    let ingredient = {
        ingredientId: foundIngredient.id,
        ingredientName: foundIngredient.ingredientName,
        amount: ingredientData.amount,
        midId: midId[0],
        recipeId: ingredientData.recipeId
    }
    return ingredient
};

async function handleNeither(ingredientData) {
    let newIngredientId = uuidv4()
    let newMidId = uuidv4()
    
    let ingredientId = await db('ingredients')
    .insert({
        id: newIngredientId,
        ingredientName: ingredientData.ingredientName
    }).returning('id')
    
    let midId = await db('recipe_ingredients')
    .insert({
        id: newMidId,
        recipeId: ingredientData.recipeId,
        ingredientId: ingredientId[0],
        amount: ingredientData.amount
    }).returning('id')
    
    let ingredient = {
        ingredientId: ingredientId[0],
        ingredientName: ingredientData.ingredientName,
        amount: ingredientData.amount,
        midId: midId[0],
        recipeId: ingredientData.recipeId
    }
    return ingredient
};

async function insertRecipeIngredient(ingredientData) {
    let foundIngredient = await db('ingredients')
    .where({ ingredientName: ingredientData.ingredientName }).first()
    let foundMid = null

    if(foundIngredient) {
        foundMid = await db('recipe_ingredients')
        .where({
             ingredientId: foundIngredient.id,
             recipeId: ingredientData.recipeId
            }).first()
    }
    
    if(foundIngredient && foundMid) {
        return handleBothIds(foundIngredient, foundMid)
    }

    if(foundIngredient && !foundMid) {
        return handleOneId(foundIngredient, ingredientData)
    }

    if(!foundIngredient && !foundMid) {
        return handleNeither(ingredientData)
    }
};

async function removeRecipeIngredient(recipeId, ingredientId) {
    return db('recipe_ingredients').where({
        ingredientId: ingredientId,
        recipeId: recipeId
    }).del()
}