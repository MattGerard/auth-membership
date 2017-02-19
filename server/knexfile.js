// Update with your config settings.
const dotenv = require('dotenv/config');
module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DB_DEV
  },

  staging: {
    client: 'postgresql',
    connection: process.env.DB_STAGING
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_PROD + '?ssl=true'
  }

};
