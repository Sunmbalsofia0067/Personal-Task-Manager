/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table
        .string('email')
        .notNullable()
        .unique()
      table.string('password').notNullable()
      table.timestamps(true, true)
    })
    .createTable('tasks', table => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('description')
      table.integer('userId')
        .notNullable()
        .references('id')
        .inTable('users')
      table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tasks').dropTableIfExists('users');
}
