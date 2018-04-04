// https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const pgPromise = require("pg-promise");
const Secrets = require("./secrets.json");

const connStr = `postgresql://${Secrets.RDS_USER}:${Secrets.RDS_PASSWORD}@${
  Secrets.RDS_HOST
}:5432/${Secrets.RDS_DB}`;

const pgp = pgPromise({}); // empty pgPromise instance
const psql = pgp(connStr); // get connection to your db instance

exports.psql = psql;
