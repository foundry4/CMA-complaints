const createMacroData = require('../lib/createMacroData');
const { Client } = require('pg');

module.exports = async  (data,req) => {
    try {
        const { fields, positions, json, values } = createMacroData(data);
        console.log('savng to database',json);
        var sql = "INSERT INTO passport_responses(" + fields + ") VALUES (" + positions + ");"
        const query = {
            text: sql,
            values: values
        }
        console.log(req.app.get('env') );
        console.log("ssl?" + (process.env.NODE_ENV === 'production'));

        try {
            console.log('Connecting to database');
            const client = new Client({
                connectionString: process.env.HEROKU_POSTGRESQL_RED_URL || process.env.DATABASE_URL,
                ssl: (process.env.NODE_ENV === 'production'),
            });
            client.connect();
            await client.query(query);
        }
        catch (err) {
            throw 'Failed to submit query to database';
        }

    }
    catch{
       throw 'Failed to connect to database';
    }
}