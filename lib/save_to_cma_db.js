
const createFormData = require('../lib/createFormData');
const { Client } = require('pg');
const createReferenceNumber = require('./utils').createReferenceNumber;
const path = require('path');
const AWS = require('aws-sdk');

module.exports.save_initial = async  (data,req) => {
    try {
        const table_name = process.env.TABLE_NAME;

        const { fields, positions, json, values } = createFormData(data);
        var sql = `INSERT INTO ${table_name}(${fields}) VALUES (${positions}) returning id;`
        const query = {
            text: sql,
            values: values
        }
        console.log('inserting into database',json);
        console.log(req.app.get('env') );
        console.log("ssl?" + (process.env.NODE_ENV === 'production'));
        console.log(sql);
        let reference = '';
        try {
            console.log('Connecting to database');
            const client = new Client({
                connectionString: process.env[process.env.HEROKU_DB_ENV_NAME] || process.env.DATABASE_URL,
                ssl: (process.env.NODE_ENV === 'production'),
            });
            client.connect();
            const res = await client.query(query);
            const id = res.rows[0].id;
            reference = createReferenceNumber(id);
            console.log('successfully inserted into database id '+id+' and updating with reference number',reference);

            //use the id to create a reference in the form CMA00000012 (8 digits so up to 99,999,999,999 entries i.e. 99 million)
            const update_sql = `UPDATE ${table_name} SET reference_number=$1 WHERE id=${id};`;
            const update_query = {
                text: update_sql,
                values: [reference]
            }
            console.log(update_sql);
            await client.query(update_query);
            let transfer_file=(req.session.data.evidence === 'true' &&req.session.data.filename&& req.session.data.evidence_url);
            // try {
            if(transfer_file){

                const ID = process.env.ACCESS_ID;
                const SECRET = process.env.ACCESS_SECRET;

                const BUCKET_NAME = process.env.BUCKET_NAME;
                const s3bucket = new AWS.S3({
                    accessKeyId: ID,
                    secretAccessKey: SECRET,
                    Bucket: BUCKET_NAME
                });
               const file_name =  req.session.data.filename;
                var get_params = {
                    Bucket: "test-upload-liz",
                    Key: file_name
                };
                await s3bucket.getObject(get_params).promise();
                var copy_params = {
                    CopySource: BUCKET_NAME + '/' + req.session.data.filename,
                    Bucket: BUCKET_NAME+'/new',
                    Key: reference+path.extname(req.session.data.filename).toLowerCase()
                };
                console.log('got data = ');
                const copy_result = await s3bucket.copyObject(copy_params).promise();
                console.log('copy result = ',copy_result);
                const delete_params = {
                    Bucket: BUCKET_NAME,
                    Key: req.session.data.filename
                }
                const evidence_url = 'asd'
                // await update_s3_url(id,ref,evidence_url);
                console.log('te')
                await s3bucket.deleteObject(delete_params).promise();
                console.log('deleted',id);
                const update_sql2 = `UPDATE ${table_name} SET evidence_url=$1 WHERE id=${id};`;
                // const url_name =ref;
                // console.log(url_name);
                const update_query2 = {
                    text: update_sql2,
                    values: [reference+path.extname(req.session.data.filename).toLowerCase()]
                }
                console.log(update_sql2,process.env[process.env.HEROKU_DB_ENV_NAME] || process.env.DATABASE_URL);
                // try {
                await client.query(update_query2);
                client.end();
                console.log('as')
            }
            await client.end();
            return {id,ref:reference};
        }
        catch (err) {
            throw 'Failed to submit query to database'+err.toString();
        }
    }
    catch(err){
       throw 'Failed to connect to database'+err.toString();
    }
}
//
// module.exports.update_s3_url = async (id,ref,url)=>{
// // try {
//     const table_name = process.env.TABLE_NAME;
//
//     const client = new Client({
//         connectionString: process.env[process.env.HEROKU_DB_ENV_NAME] || process.env.DATABASE_URL,
//         ssl: (process.env.NODE_ENV === 'production'),
//     });
//     console.log(client);
//     const update_sql = `UPDATE ${table_name} SET reference_number=$1 WHERE id=${id};`;
//     // const url_name =ref;
//     // console.log(url_name);
//     const update_query = {
//         text: update_sql,
//         values: ['as']
//     }
//     console.log(update_sql,process.env[process.env.HEROKU_DB_ENV_NAME] || process.env.DATABASE_URL);
//     // try {
//         await client.query(update_query);
//             client.end();
//         console.log('as')
//     // }
//     // catch (err) {
//     //     console.log('ererererere');
//     //     throw 'Failed to submit query to database'+err.toString();
//     // }
//     console.log('successfully updated url')
// // }
// // catch(err){
// //     throw 'Failed to connect to database'+err.toString();
// }
// // }