// NOTE https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const { GraphQLSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");

const { resolvers } = require("./resolver.js");

const typeDefs = `
  scalar Date

  type Roaster {
    id: ID!
    name: String!
    location: String
    coffees: [Coffee]
  }

  type Coffee {
    id: ID!
    name: String!
    roast_type: String
    roast_style: String
    roaster: Roaster!
    regions: [String]
  }

  type Brew {
    id: ID!
    created_at: Date!
    updated_at: Date!
    coffee: Coffee!
    rating: Float
    flavours: [String]
    method: String
    notes: String
    # metadata: String
  }

  # the following queries are allowed
  # e.g. https://www.apollographql.com/docs/graphql-tools/generate-schema.html#example
  type Query {
    roasters: [Roaster]!,
    coffee: [Coffee]!
    brews: [Brew]!
  }
`;

exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
