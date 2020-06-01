exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('recipes').del()
    .then(function () {
      // Inserts seed entries
      return knex('recipes').insert([
        {
          user_id: 1,
          recipeName: 'Teriyaki Beef Short Ribs',
          imageURL: 'http://res.cloudinary.com/imagevideo/image/upload/v1589862708/qyp11zkfc9pteh1w7zsl.jpg',
          prepTime: '15 minutes',
          cookTime: '15 minutes',
          serving: '2 people',
          ingredients: 
            '4 pieces beef short ribs, 1/2 cup teriyaki sauce, 1 tablespoon butter',
          instructions: 
            'Marinate the beef short ribs with teriyaki sauce for 15 minutes. Put butter in a medium heated pan. Grill the ribs in pan until the meat color turn brown. Meat will be chewy if over cooked.'

        },
        {
          user_id: 1,
          recipeName: 'Abalone Wonton Noodle',
          imageURL: 'http://res.cloudinary.com/imagevideo/image/upload/v1589862419/gtyxhuteriiq1un1entx.jpg',
          prepTime: '15 minutes',
          cookTime: '15 minutes',
          serving: '2 people',
          ingredients: 
            '4 canned ready to eat abalones, 12 frozen wontons, 2 bags of instant Shin ramen, 1 chopped lettuce, 2 green onions',
          instructions: 
            'put everthing into a pan of boiling water.'
        },
        {
          user_id: 1,
          recipeName: 'Unagi Don',
          imageURL: 'http://res.cloudinary.com/imagevideo/image/upload/v1589670461/bvesjfh1fnbx1chsq7ll.jpg',
          prepTime: '5 minutes',
          cookTime: '25 minutes',
          serving: '2 people',
          ingredients: 
            '1 pack of 12 oz cooked frozen unagi, 1 cup of rice, 1 cup of water',
          instructions: 
            'Put rice and water into a rice cooker and let it auto cook. When the rice is almost cooked, put the frozen unagi into the rice cooker and let it cook on top of the rice for 10 minutes.'
        }
      ]);
    });
};
