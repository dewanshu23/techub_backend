const { Pool } = require("pg"); // This is the postgres database connection module.

const dbStrings = require("./createModels.js");

let pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_techub",
  password: 'sith1234',
  port: 5432,
  max: 100,
  logging: false,
  dialect: 'postgres',
});

let db = {}
db.pool = pool;
db.dbStrings = dbStrings;
module.exports = db;
