const Pool = require('pg').Pool;


const pool = new Pool({
    host: "localhost",
    port: 5432,
    dbname: "template1",
    user: "postgres",
    password: process.env.DATABASE_PASSWORD,
    connect_timeout: 10
})

module.exports = pool;
