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
    async coffee(_, { id, limit, offset = 0 }) {
      let where = id ? "where id = $1" : "";
      let limitClause = limit
        ? `order by id limit ${limit} offset ${offset}`
        : "";
      const q = `select * from coffees ${limitClause} ${where};`;
      return await psql.manyOrNone(q, id);
    },
    async brews(_, { id, coffee, limit, offset = 0 }) {
      let limitClause = limit
        ? `order by id desc limit ${limit} offset ${offset}`
        : "";
      let wheres = [];
      if (id) wheres.push(`id = ${id}`);
      if (coffee) wheres.push(`coffee_id = ${coffee}`);
      let whereClause = wheres.length ? `where ${wheres.join(" and ")}` : "";
      let q = `select * from brews ${whereClause} ${limitClause};`;
      return await psql.manyOrNone(q);
    },
  },

  Mutation: {
    async createBrew(_, args) {
      const { coffeeID, metadata, flavours, ...otherArgs } = args;
      let insertValues = {
        coffee_id: coffeeID,
        flavours: flavours ? JSON.stringify(flavours) : null,
        metadata: JSON.stringify(metadata || {}),
        ...otherArgs,
      };
      let insertCols = Object.keys(insertValues);
      let cols = insertCols.join(", ");
      let interpVals = insertCols.map(c => "${" + c + "}").join(", ");
      let q = `
        INSERT INTO brews (${cols})
        VALUES (${interpVals})
        RETURNING *;
      `;
      return await psql.one(q, insertValues);
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
    avgRating: async coffee => {
      const q = `
        select coffees.id, avg(brews.rating) as avgRating
        from coffees
        inner join brews
          on brews.coffee_id = coffees.id
        where coffees.id = $1
        group by coffees.id;
      `;
      const { avgrating } = await psql.one(q, coffee.id);
      return avgrating;
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
