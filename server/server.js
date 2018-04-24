// https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const jwt = require("express-jwt");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");

const { psql } = require("./psqlAdapter");
const { schema } = require("./schema.js");

require("dotenv").config();

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  console.error("must provide a JWT_SECRET env var");
  process.exit(1);
}

const GraphQLServer = express().use("*", cors());

// basic health route, ping /health to determine server health
GraphQLServer.get("/health", (req, res) => {
  res.sendStatus(200);
});

// graphiql explorer
// ping /graphiql for an in-browser GUI explorer
GraphQLServer.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL:
      process.env.NODE_ENV === "production" ? "/latest/graphql" : "/graphql",
  }),
);

function getUserWithID(userID) {
  let q = "select id, email from users where id = ${id}";
  return () => psql.one(q, { id: userID });
}

// graphql endpoint
GraphQLServer.use(
  "/",
  bodyParser.json(),
  jwt({
    secret: JWT_SECRET,
    credentialsRequired: false,
  }),
  graphqlExpress(req => ({
    schema,
    context: {
      getUser: req.user
        ? getUserWithID(req.user.id)
        : () => Promise.reject("Unauthenticated"),
    },
  })),
);

module.exports = GraphQLServer;
