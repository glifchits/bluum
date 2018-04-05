// https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const graphqlExpress = require("graphql-server-express").graphqlExpress;
const graphiqlExpress = require("graphql-server-express").graphiqlExpress;

const { schema } = require("./schema.js");

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

// graphql endpoint
GraphQLServer.use("/", bodyParser.json(), graphqlExpress({ schema }));

module.exports = GraphQLServer;
