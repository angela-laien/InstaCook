const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          username: 'Angela123', 
          password: bcrypt.hashSync('Angela123', 10)
        },
      ]);
    });
};
