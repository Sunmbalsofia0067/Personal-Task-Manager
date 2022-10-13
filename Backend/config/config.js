import {config} from 'dotenv';

config();

const { DB_HOST, DB_USERNAME, DB_PASSWORD,DB , DB_DIALECT, DB_PORT} = process.env;


const configDBMS = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB,
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
  },

  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "database_test",
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: "database_production",
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
  }
};

export default configDBMS;