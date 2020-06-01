const db = require('../../database/db-config');

module.exports = {
    getRecipes,
}

function getRecipes(){
    return db("recipes")
    .orderBy('recipes.id')
}