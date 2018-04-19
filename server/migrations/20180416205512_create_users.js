exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t.increments("id");
    t.string("email").notNullable();
    t.unique("email");
    t.string("password").notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
