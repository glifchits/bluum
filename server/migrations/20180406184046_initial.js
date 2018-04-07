// NOTE https://hackernoon.com/setting-up-node-js-with-a-database-part-1-3f2461bdd77f

exports.up = function(knex, Promise) {
  // first create table for roasters
  function createRoastersTable() {
    return knex.schema.createTable("roasters", t => {
      t.increments("id");
      t.string("name").notNullable();
      t.string("location");
      t.timestamps(true, true);
      t.jsonb("metadata");
    });
  }
  // then coffee table (lol). It has FK ref to roaster
  function createCoffeesTable() {
    return knex.schema.createTable("coffees", t => {
      t.bigIncrements("id");
      t.string("name").notNullable();
      t.timestamps(true, true);
      t.text("description");
      t.string("roast_style"); // light, med, dark
      t.string("roast_type"); // filter, espresso
      t.jsonb("regions");
      t.jsonb("metadata");
      t
        .integer("roaster_id")
        .unsigned()
        .references("roasters.id")
        .onDelete("SET NULL");
    });
  }
  // brews table
  function createBrewsTable() {
    return knex.schema.createTable("brews", t => {
      t.increments("id");
      t.timestamps(true, true);
      t.bigInteger("coffee_id").unsigned();
      t
        .foreign("coffee_id")
        .references("coffees.id")
        .onDelete("SET NULL");
      t.decimal("rating", 5, 2); // precision=5, scale=2 (999.99)
      t.string("method");
      t.jsonb("flavours");
      t.text("notes");
      t.jsonb("metadata");
    });
  }

  return createRoastersTable()
    .then(createCoffeesTable)
    .then(createBrewsTable);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("coffees"),
    knex.schema.dropTableIfExists("roasters"),
    knex.schema.dropTableIfExists("brews"),
  ]);
};
