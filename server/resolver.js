// NOTE https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const { psql } = require("./psqlAdapter"); // our adapter from psqlAdapter.js

// should match type Query in schema.js
// one function per endpoint
exports.resolvers = {
  Query: {
    async roasters(_, { id }) {
      const query = `select * from roasters ${id ? "where id = $1" : ""};`;
      return await psql.manyOrNone(query, id);
    },
    async coffee(_, { id }) {
      let where = id ? "where id = $1" : "";
      const q = `select * from coffees ${where}`;
      return await psql.manyOrNone(q, id);
    },
    async brews(_, { id }) {
      let where = id ? "where id = $1" : "";
      let q = `select * from brews ${where};`;
      return await psql.manyOrNone(q, id);
    },
  },

  Coffee: {
    roaster: async coffee => {
      const q = `
        select id, name from roasters
        where id = $1;
      `;
      return await psql.one(q, coffee.roaster_id);
    },
  },

  Roaster: {
    coffees: async roaster => {
      const q = `
        select id, name, roaster_id, regions
        from coffees
        where roaster_id = $1;
      `;
      return await psql.manyOrNone(q, roaster.id);
    },
  },

  Brew: {
    coffee: brew =>
      psql.one(`select * from coffees where id = $1`, brew.coffee_id),
  },
};
