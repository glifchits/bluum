exports.up = function(knex, Promise) {
  return knex.schema.table("roasters", t => {
    t.text("description");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("roasters", t => {
    t.dropColumn("description");
  });
};
