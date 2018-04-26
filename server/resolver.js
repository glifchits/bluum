// NOTE https://medium.com/@james_mensch/node-js-graphql-postgresql-quickstart-91ffa4374663
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { psql } = require("./psqlAdapter"); // our adapter from psqlAdapter.js
require("dotenv").config();

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  console.error("must provide a JWT_SECRET env var");
  process.exit(1);
}

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

    async latestBrewedCoffees(_, { limit }, ctx) {
      let user = await ctx.getUser();
      let q = `
        select coffee_id, max(b.created_at) time_last_brewed, c.*
        from brews b
        inner join coffees c
          on c.id = b.coffee_id
        where b.created_by = $1
        group by coffee_id, c.id
        order by time_last_brewed desc
        ${limit ? `limit ${limit}` : ""};
      `;
      return await psql.manyOrNone(q, user.id);
    },

    userProfile: async (_, args, ctx) => {
      let user = await ctx.getUser();
      let q =
        "select id, email, created_at, updated_at " +
        "from users where id = ${id};";
      return await psql.one(q, { id: user.id });
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

    createCoffee: async (_, { regions, metadata, ...args }, ctx) => {
      let user = await ctx.getUser();
      let insertValues = {
        ...args,
        regions: regions ? JSON.stringify(regions) : null,
        metadata: JSON.stringify(metadata || {}),
        created_by: user.id,
      };
      let insertCols = Object.keys(insertValues);
      let q = `
        INSERT INTO coffees (${insertCols.join(", ")})
        VALUES (${insertCols.map(c => "${" + c + "}").join(", ")})
        RETURNING *;
      `;
      return await psql.one(q, insertValues);
    },

    createBrew: async (_, args, ctx) => {
      let user = await ctx.getUser();
      const { coffeeID, metadata, flavours, ...otherArgs } = args;
      let insertValues = {
        coffee_id: coffeeID,
        flavours: flavours ? JSON.stringify(flavours) : null,
        metadata: JSON.stringify(metadata || {}),
        created_by: user.id,
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

    signupUser: async (_, { email, password }) => {
      let insertUser =
        "INSERT INTO users (email, password) " +
        "VALUES (${email}, ${password}) " +
        "RETURNING id, email, created_at, updated_at;";

      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await psql.one(insertUser, {
        email: email,
        password: hashedPassword,
      });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

      return {
        ...user,
        jwt: token,
      };
    },

    loginUser: async (_, { email, password }) => {
      let q = "SELECT id, email, password FROM users WHERE email = $1;";
      let candidate = await psql.one(q, email);

      const passwordValid = await bcrypt.compare(password, candidate.password);
      if (!passwordValid) {
        return Promise.reject("password invalid");
      }

      let user = { ...candidate };
      delete user.password;

      // NOTE, section 7.4
      // https://medium.com/react-native-training/building-chatty-part-7-authentication-in-graphql-cd37770e5ab3
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

      return {
        ...user,
        jwt: token,
      };
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
