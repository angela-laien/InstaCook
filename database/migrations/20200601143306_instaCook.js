exports.up = function(knex) {
    return(
        knex.schema
        // users
        .createTable('users', users => {
            users.increments('id')
            users
              .string('username', 255)
              .notNullable()
              .unique();
            users
              .string('password', 255)
              .notNullable();
        })
  
        .createTable('recipes', recipes => {
            recipes.increments('id')
            recipes
              .integer('user_id', 255)
              .notNullable()
              .references('users.id')
              .onDelete('CASCADE')
              .onUpdate('CASCADE')
            recipes
              .string('recipeName', 255)
              .notNullable()
              .unique()
            recipes.text('imageURL')
            recipes.string('prepTime')
            recipes.string('cookTime')
            recipes.string('serving')
            recipes.text('ingredients')
            recipes.text('instructions')
        })
    )
};
  
exports.down = function(knex) {
return knex.schema
    .dropTableIfExists('recipes')
    .dropTableIfExists('users')
};
