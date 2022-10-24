/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {

  await knex.raw('TRUNCATE TABLE users CASCADE');
  await knex.raw('TRUNCATE TABLE tasks CASCADE');
  // Deletes ALL existing entries
  // await knex('users').del();
  await knex('users').insert([
    {
      id: 1, 
      first_name: 'Sunmbal', 
      last_name: 'Sofia', 
      email: 'ssofia@test.com', 
      password: "12345678"
    },

    {
      id: 2, 
      first_name: 'Farwa', 
      last_name: 'Abbas', 
      email: 'farwaa@test.com', 
      password: "12345678"
    },
    {
      id: 3, 
      first_name: 'Hamza', 
      last_name: 'Arslan', 
      email: 'arslan@test.com', 
      password: "12345678"
    },
  ]);

  await knex('tasks').insert([
    {
      id: 1,
      title: "My task 1",
      description: "Testing description 1",
      userID: 3
    },

    {
      id: 2,
      title: "My task 2",
      description: "Testing description 2",
      userId: 3
    },

  ]);

};