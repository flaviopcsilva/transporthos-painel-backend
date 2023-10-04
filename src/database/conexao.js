const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.SERVER_DB,
        port: process.env.PORT_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE_DB
    }
});

module.exports = knex