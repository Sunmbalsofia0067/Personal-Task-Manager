/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.table('tasks', table => {
      table.string('status').notNullable().defaultTo("Pending");
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('tasks', table => {
      table.dropColumn('status');
    })
  };