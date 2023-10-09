const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'babar.db.elephantsql.com',
        port: process.env.PORT_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE_DB
    }
});

module.exports = knex