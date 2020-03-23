exports.up = function(knex) {
  console.log("creating user table");
  return knex.schema.createTable("users", userTable => {
    userTable
      .string("username")
      .primary()
      .unique();
    userTable.string("avatar_url").notNullable();
    userTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  console.log("dropping user table");
  return knex.schema.dropTable("users");
};
