const AWS = require('aws-sdk');
const multer  = require('multer');

const ID = 'AKIAIC2TFTJ57HS4IAGQ';
const SECRET = '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';

const BUCKET_NAME = 'test-upload-liz';
const s3bucket = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    Bucket: BUCKET_NAME
});

module.exports.upload=(body)=>{
    var params = {
        Bucket: BUCKET_NAME,
        Key: 123,
        Body: item.buffer,
        ACL: 'public-read'
    };
    s3bucket.upload(params, function (err, data) {
        if (err) {
            res.json({ "error": true, "Message": err});
        }else{
            ResponseData.push(data);
            if(ResponseData.length == file.length){
                res.json({ "error": false, "Message": "File Uploaded    SuceesFully", Data: ResponseData});
            }
        }
    });
});
});
}