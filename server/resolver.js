// https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const { psql } = require("./psqlAdapter"); // our adapter from psqlAdapter.js

// should match type Query in schema.js
// one function per endpoint
exports.resolvers = {
  Query: {
    async roasters(_, args, ctx) {
      const query = `select id, name from coffee_roaster;`;
      return await psql.manyOrNone(query);
    },
    async coffee(_, args, ctx) {
      const q = `select id, name, roaster_id, regions from coffee_coffee;`;
      return await psql.manyOrNone(q);
    },
  },

  Coffee: {
    roaster: async coffee => {
      const q = `
        select id, name from coffee_roaster
        where id = ${coffee.roaster_id};
      `;
      const x = await psql.manyOrNone(q);
      return x[0];
    },
  },

  Roaster: {
    coffees: async roaster => {
      const q = `
        select id, name, roaster_id, regions
        from coffee_coffee
        where roaster_id=${roaster.id};
      `;
      return await psql.manyOrNone(q);
    },
  },
};
