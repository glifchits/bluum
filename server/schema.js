// NOTE https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const { GraphQLSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");
const GraphQLJSON = require("graphql-type-json");

const { resolvers } = require("./resolver.js");

const typeDefs = `
  scalar Date
  scalar JSON

  type Roaster {
    id: ID!
    created_at: Date!
    updated_at: Date!
    name: String!
    location: String
    coffees: [Coffee]
  }

  type Coffee {
    id: ID!
    created_at: Date!
    updated_at: Date!
    name: String!
    roast_type: String
    roast_style: String
    roaster: Roaster!
    regions: [String]
    metadata: JSON
    avgRating: Float!
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
    metadata: JSON
  }

  # the following queries are allowed
  # e.g. https://www.apollographql.com/docs/graphql-tools/generate-schema.html#example
  type Query {
    roasters(id: ID): [Roaster]!,
    coffee(id: ID, limit: Int, offset: Int): [Coffee]!
    brews(id: ID, limit: Int, offset: Int, coffee: ID): [Brew]!
  }
`;

exports.schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,
    JSON: GraphQLJSON,
  },
});
