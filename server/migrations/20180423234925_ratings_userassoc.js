exports.up = function(knex, Promise) {
  // associate users to things
  let assocRoasters = () =>
    knex.schema.table("roasters", t => {
      t
        .integer("created_by")
        .unsigned()
        .references("users.id")
        .onDelete("SET NULL");
    });
  let assocCoffees = () =>
    knex.schema.table("coffees", t => {
      t
        .integer("created_by")
        .unsigned()
        .references("users.id")
        .onDelete("SET NULL");
    });
  let assocBrews = () =>
    knex.schema.table("brews", t => {
      t
        .integer("created_by")
        .unsigned()
        .references("users.id")
        .onDelete("SET NULL");
    });
  //
  // create ratings table
  //
  let createRatings = () =>
    knex.schema.createTable("ratings", t => {
      t.bigIncrements("id");
      t.decimal("rating", 5, 2); // precision=5, scale=2 (999.99)
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t
        .integer("coffee_id")
        .unsigned()
        .references("coffees.id")
        .onDelete("SET NULL");
      t
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("SET NULL");
    });

  return Promise.all([
    assocRoasters(),
    assocCoffees(),
    assocBrews(),
    createRatings(),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("roasters", t => t.dropColumn("created_by")),
    knex.schema.table("coffees", t => t.dropColumn("created_by")),
    knex.schema.table("brews", t => t.dropColumn("created_by")),
    knex.schema.dropTableIfExists("ratings"),
  ]);
};
