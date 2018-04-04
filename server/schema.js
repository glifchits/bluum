// https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const { GraphQLSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");

const { resolvers } = require("./resolver.js");

const typeDefs = `
  type Roaster {
    id: String!
    name: String!
    coffees: [Coffee]
  }

  type Coffee {
    id: String!
    name: String!
    roaster: Roaster
    regions: [String]
  }

  # the following queries are allowed
  # e.g. https://www.apollographql.com/docs/graphql-tools/generate-schema.html#example
  type Query {
    roasters: [Roaster]!,
    coffee: [Coffee]!
  }
`;

exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
