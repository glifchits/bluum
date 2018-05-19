// https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const pgPromise = require("pg-promise");

require("dotenv").config();

const connStr = process.env.BLUUM_RDS;
const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connStr); // get connection to your db instance

exports.psql = psql;
