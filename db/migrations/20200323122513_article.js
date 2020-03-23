exports.up = function(knex) {
  console.log("creating article table");
  return knex.schema.createTable("articles", articleTable => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.text("body");
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topics").references("topics.slug");
    articleTable.string("author").references("users.username");
    articleTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  console.log("dropping article table");
  return knex.schema.dropTable("article");
};
