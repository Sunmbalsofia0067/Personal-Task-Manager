const {knexSnakeCaseMapper} = require('objection');

module.exports = {
    development: {
      client: 'pg',
      connection: {
        database: 'taskManagerDB',
        user: 'postgres',
        password: 'Sofia'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },
    seeds:{
      directory: './seeds',
    },
    ...knexSnakeCaseMapper,
  };
