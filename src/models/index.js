const {Pool} = require("pg"); // This is the postgres database connection module.

const dbStrings = require("./createModels.js");

let pool = new Pool({
    user: "postgres",
    password: 'sith1234',//change according to your password TODO: change to basic
    host: "localhost",
    database: "mydb",
    port: 5432,
    max: 1000,
    logging: false,
    dialect: 'postgres',
});

async function query(text, params) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        client.release();
    }
}

async function executeSQLCreate(sql, key) {
    try {
        let result = await query(sql);
        console.log(`Executed ${key} with result:`, result.rows ?? "Failed");
    } catch (err) {
        console.error(`Error executing ${key}:`, err);
    }
}

async function processIndexFile() {
    const dbScripts = dbStrings;
    for (const key in dbScripts) {
        const sql = dbScripts[key];
        await executeSQLCreate(sql, key);
    }
}

async function execute(query, values = []) {
    if (query == undefined || query == null || query == "") {
        return "Query is empty"
    }
    let client;
    try {
        client = await pool.connect();
        let results = await client.query(query, values);
        client.release();
        return results;
    } catch (err) {
        if (client != undefined)
            client.release();
        return err;
    }
}

async function runner(queryMap) {
    try {
        let results = await execute(queryMap.query, queryMap.values);
        return results.rows;
    } catch (e) {
        console.error(e);
        return e;
    }
}

let db = {}
db.pool = pool;
db.dbStrings = dbStrings;
db.processIndexFile = processIndexFile;
db.runner = runner;
module.exports = db;