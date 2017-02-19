exports.up = function(knex, Promise) {
    return knex.schema.createTable('todo', (table) => {
        table.increments();
        table.text('title').notNullable();
        table.text('description');
        table.integer('priority').notNullable();
        table.boolean('done').defaultTo(false).notNullable();
        table.dateTime('date').notNullable();
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('todo');
};
