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
    async coffee(_, { id, limit, offset = 0, searchTerm }) {
      let q;
      let args;

      if (id) {
        q = `select * from coffees where id = $1`;
        args = [id];
      }
      if (limit) {
        q = `select * from coffees
              order by id desc
              limit $1 offset $2`;
        args = [limit, offset];
      }
      if (searchTerm) {
        q = `select c.*
             from coffees c
             inner join roasters r
               on r.id = c.roaster_id
             where
               c.name ilike $1
               or r.name ilike $1
             limit 10;`;
        args = [`%${searchTerm}%`];
      }
      return await psql.manyOrNone(q, args);
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
    async latestBrewedCoffees(_, { limit }) {
      let q = `
        select coffee_id, max(b.created_at) time_last_brewed, c.*
        from brews b
        inner join coffees c
          on c.id = b.coffee_id
        group by coffee_id, c.id
        order by time_last_brewed desc
        ${limit ? `limit ${limit}` : ""};
      `;
      return await psql.manyOrNone(q);
    },
  },

  Mutation: {
    async createRoaster(_, args) {
      let insertValues = {
        ...args,
        metadata: JSON.stringify(args.metadata || {}),
      };
      let insertCols = Object.keys(insertValues);
      let q = `
        INSERT INTO roasters (${insertCols.join(", ")})
        VALUES (${insertCols.map(c => "${" + c + "}").join(", ")})
        RETURNING *;
      `;
      return await psql.one(q, insertValues);
    },

    async createCoffee(_, { regions, metadata, ...args }) {
      let insertValues = {
        ...args,
        regions: regions ? JSON.stringify(regions) : null,
        metadata: JSON.stringify(metadata || {}),
      };
      let insertCols = Object.keys(insertValues);
      let q = `
        INSERT INTO coffees (${insertCols.join(", ")})
        VALUES (${insertCols.map(c => "${" + c + "}").join(", ")})
        RETURNING *;
      `;
      return await psql.one(q, insertValues);
    },

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
      const ret = await psql.oneOrNone(q, coffee.id);
      return ret ? ret.avgrating : null;
    },
    last_brewed: async coffee => {
      const q = `
        select max(created_at) as last_brewed
        from brews
        where coffee_id = $1
      `;
      const ret = await psql.oneOrNone(q, coffee.id);
      return ret ? ret.last_brewed : null;
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
