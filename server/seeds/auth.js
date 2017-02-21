
        // knex.schema.createTable('users', (table) => {
        //     table.increments('uid').primary();
        //     table.string('username');
        //     table.string('email').unique().notNullable();
        //     table.boolean('admin').notNullable().defaultTo(false);
        //     table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        // }),
        // knex.schema.createTable('claims', (table) => {
        //     table.integer('type_id')
        //          .references('id')
        //          .inTable('claim_types')
        //          .notNullable();
        //     table.integer('user_id')
        //          .references('uid')
        //          .inTable('users')
        //          .notNullable();
        //     table.string('auth_token').notNullable();
        //     table.string('refresh_token').notNullable();
        //     table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
        // }),
        // knex.schema.createTable('claim_types', (table) => {
        //     table.increments('id').primary();
        //     table.string('name').unique().notNullable();
        // }),

exports.seed = (knex, Promise) => {
  return knex('users').del()
  .then(() => {
    return Promise.join(
      knex('users').insert({
        username: 'bteamgaming',
        email: 'august@bteamgaming.com',
        admin: true,
      })
    );
  })
  .then((res) => {
    console.log(res, 'response from seed 2nd')
    return Promise.join(
      knex('claim_types').insert({
        name: 'TWITCH',
      })
    );
  });
};