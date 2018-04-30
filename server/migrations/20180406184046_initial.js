// NOTE https://hackernoon.com/setting-up-node-js-with-a-database-part-1-3f2461bdd77f

exports.up = function(knex, Promise) {
  // first create table for roasters
  function createRoastersTable() {
    return knex.schema.createTable("roasters", t => {
      t.increments("id");
      t.string("name").notNullable();
      t.string("location");
      t.text("description");
      t.timestamps(true, true);
      t
        .jsonb("metadata")
        .notNullable()
        .defaultTo("{}");
      t.integer("created_by").unsigned();
      t
        .foreign("created_by")
        .references("users.id")
        .onDelete("SET NULL");
    });
  }
  // then coffee table (lol). It has FK ref to roaster
  function createCoffeesTable() {
    return knex.schema.createTable("coffees", t => {
      t.increments("id");
      t.string("name").notNullable();
      t.timestamps(true, true);
      t.text("description");
      t.string("roast_style"); // light, med, dark
      t.string("roast_type"); // filter, espresso
      t
        .jsonb("regions")
        .notNullable()
        .defaultTo("[]");
      t
        .jsonb("metadata")
        .notNullable()
        .defaultTo("{}");
      t.integer("roaster_id").unsigned();
      t
        .foreign("roaster_id")
        .references("roasters.id")
        .onDelete("SET NULL");
      t.integer("created_by").unsigned();
      t
        .foreign("created_by")
        .references("users.id")
        .onDelete("SET NULL");
    });
  }
  // brews table
  function createBrewsTable() {
    return knex.schema.createTable("brews", t => {
      t.increments("id");
      t.timestamps(true, true);
      t.integer("coffee_id").unsigned();
      t
        .foreign("coffee_id")
        .references("coffees.id")
        .onDelete("SET NULL");
      t.decimal("rating", 5, 2); // precision=5, scale=2 (999.99)
      t.string("method");
      t
        .jsonb("flavours")
        .notNullable()
        .defaultTo("[]");
      t.text("notes");
      t
        .jsonb("metadata")
        .notNullable()
        .defaultTo("{}");
      t.integer("created_by").unsigned();
      t
        .foreign("created_by")
        .references("users.id")
        .onDelete("SET NULL");
    });
  }
  // users table
  function createUsersTable() {
    return knex.schema.createTable("users", t => {
      t.increments("id");
      t.string("email").notNullable();
      t.unique("email");
      t.string("password").notNullable();
      t.timestamps(true, true);
    });
  }
  // ratings table
  function createRatingsTable() {
    return knex.schema.createTable("ratings", t => {
      t.bigIncrements("id");
      t.decimal("rating", 5, 2); // precision=5, scale=2 (999.99)
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.integer("coffee_id").unsigned();
      t
        .foreign("coffee_id")
        .references("coffees.id")
        .onDelete("SET NULL");
      t.integer("user_id").unsigned();
      t
        .foreign("user_id")
        .references("users.id")
        .onDelete("SET NULL");
      t.unique(["coffee_id", "user_id"]);
    });
  }

  return createUsersTable()
    .then(createRoastersTable)
    .then(createCoffeesTable)
    .then(createBrewsTable)
    .then(createRatingsTable);
};

exports.down = function(knex, Promise) {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists("brews"))
    .then(() => knex.schema.dropTableIfExists("ratings"))
    .then(() => knex.schema.dropTableIfExists("coffees"))
    .then(() => knex.schema.dropTableIfExists("roasters"))
    .then(() => knex.schema.dropTableIfExists("users"));
};
