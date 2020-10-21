exports.up = function(knex) {
    return(
        knex.schema
        // users
        .createTable('users', users => {
            users.increments('id');
            users
              .string('username', 255)
              .notNullable()
              .unique();
            users
              .string('password', 255)
              .notNullable();
            users
              .text('imageURL');
        })
  
        .createTable('recipes', recipes => {
            recipes
              .increments('id')
              .unique();
            recipes
              .integer('user_id', 255)
              .notNullable()
              .references('users.id')
              .onDelete('CASCADE')
              .onUpdate('CASCADE');
            recipes
              .string('recipeName', 255)
              .notNullable()
              .unique();
            recipes.text('imageURL');
            recipes.string('prepTime');
            recipes.string('cookTime');
            recipes.string('serving');
            // recipes.text('ingredients')
            // recipes.text('instructions')
        })

        .createTable('steps', steps => {
          steps
            .increments('id')
            .unique();
          steps
            .integer('recipeId', 255)
            .references('recipes.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
          steps
            .integer('number', 255)
            .notNullable();
          steps
            .text('instruction')
            .notNullable();
        })

        .createTable('ingredients', ingredients => {
          ingredients
            .increments('id')
            .unique();
          ingredients
            .string('ingredientName', 255)
            .unique()
            .notNullable();
        })

        .createTable('recipe_ingredients', recipe_ingredients => {
          recipe_ingredients
            .increments('id')
            .unique()
          recipe_ingredients
            .string('recipeId', 255)
            .notNullable()
            .references('recipes.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
          recipe_ingredients
            .string('ingredientId', 255)
            .notNullable()
            .references('ingredients.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
          recipe_ingredients
            .string('amount', 255)
        })
    )
};
  
exports.down = function(knex) {
return knex.schema
    .dropTableIfExists('recipe_ingredients')
    .dropTableIfExists('ingredients')
    .dropTableIfExists('steps')
    .dropTableIfExists('recipes')
    .dropTableIfExists('users')
};
