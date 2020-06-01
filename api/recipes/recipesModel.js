const db = require('../../database/db-config');

module.exports = {
    // getRecipes,
    findById,
    update,
    remove
}

// function getRecipes(){
//     return db("recipes")
//     .orderBy('recipes.id')
// }

function findById(id) {
    return db('recipes')
    .where({ id })
    .first();
}

function update(changes, id){
    return db("recipes")
    .update(changes)
    .where({ id });
}

function remove(id) {
    return db("recipes")
    .where({ id })
    .del()
}