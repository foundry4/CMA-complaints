const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db').save_initial;
const update_s3_url = require('../lib/save_to_cma_db').update_s3_url;
const {reports,food_products,hygiene_products,medical_products, other_products, business_section, business_reason, contact_section, product_section} = require('../lib/constants');
const products = [...food_products,...hygiene_products,...medical_products, ...other_products];
var multer = require('multer');
var multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const ID = process.env.ACCESS_ID;
const SECRET = process.env.ACCESS_SECRET;

const BUCKET_NAME = process.env.BUCKET_NAME;
const s3bucket = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    Bucket: BUCKET_NAME
});
const validate_pack_sizes =(body)=>{
    const array = [];
    for (index in products){
        const name = products[index].name+'_pack_size';
        array.push(body(name)
            .if(body(name).notEmpty())
            .isInt().withMessage('Enter a valid pack size for '+products[index].text));
    }
    return array;
}

const validate_names =(body)=>{
    const array = [];
    for (let index in other_products){
        const name = other_products[index].name+'_product_name';

        array.push(body(name).custom((value,{req}) => {
            if(req.body['product'].includes(other_products[index].name)&&!req.body[name]) {
                throw new Error('Enter a name for the product the report is about');
            }
            return true;
        }));
    }
    return array;
}

const validate_expected_price =(body)=>{
    const array = [];
    for (index in products){
        const current_name = products[index].name+'_current_price';
        array.push(body(current_name)
            .if(body(current_name).notEmpty())
            .isNumeric().withMessage('Enter a valid curent price for '+products[index].text));
        const expected_name = products[index].name+'_expected_price';
        array.push(body(expected_name)
            .if(body(expected_name).notEmpty())
            .isNumeric().withMessage('Enter a valid expected price for '+products[index].text));
    }
    return array;
}


// GET home page
router.get('/', function (req, res, next) {
    if (!req.session.data){
        req.session.data = {};
    }
  res.render('index', {
    reports
  });
});
router.get('/reset_session', function (req, res) {
    req.session.data = {};
    res.redirect('/what_behaviour');
});

router.get('/what_behaviour', function (req, res) {
    res.render('what_behaviour', {
        reports,
        values: req.session.data
    });
});
router.post('/what_behaviour',
    [ body('report_reason')
        .exists()
        .not().isEmpty().withMessage('Enter the reason for your report') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                const reason = request.session.data.report_reason;
               if(reason === 'consumer_pricing'|| reason==='business_pricing'){
                   response.redirect('/which_products');
               }
               else {
                   response.redirect('/what_happened');
               }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errors,errorSummary);
                try {
                    response.render('what_behaviour', {
                        reports,
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);



router.get('/what_happened', function (req, res) {
    res.render('what_happened', {
        reports,
        values: req.session.data
    });
});
router.post('/what_happened',
    [ body('description')
        .exists()
        .not().isEmpty().withMessage('Please give a full description of the issue.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/where_was_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('what_happened', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

// router.get('/summary', function (req, res) {
//     var data = req.session.data;
//     console.log('final data = ', data);
//
//     // loop through the business
//     var business = Object.keys(business_section).map(function (key) {
//         var val = data[key];
//         var url = business_section[key].url;
//         if(key=='location'){
//             if( data['is-online'] ){
//                 val = data['website'] +'<br>' + data['business-email'];
//                 // update url
//                 url ='/what_is_business_url';
//             }else{
//                 val = data['street-name'];
//                 val += '<br/>' + data['town-name'];
//                 val += '<br/>' + data['postcode'];
//             }
//         }
//         return {name:business_section[key].text, value:val, url:url}
//     });
//
//     // loop through the reasons
//     var date = data['date-day'] + " "+ data['date-month']+ " "+ data['date-year'];
//     var reason = Object.keys(business_reason).map(function (key) {
//         var val = data[key];
//         if (key === 'date'){
//             val = date;
//         }
//         if (key === 'report_reason' ){
//             if(data['reason_other']){
//                 val = data[key];
//             }else{
//
//                 for (var i = 0; i < reports.length; i++) {
//                     if (reports[i].name == data[key]) {
//                         val = reports[i].text;
//                     }
//                 }
//             }
//
//         }
//         return {name:business_reason[key].text, value:val, url:business_reason[key].url}
//     });
//
//     // loop through the contacts
//     var contacts = Object.keys(contact_section).map(function (key) {
//         return {name:contact_section[key].text, value:data[key], url:contact_section[key].url}
//     });
//
//     // loop through the products ARRAY
//     var product_list =[];
//
//     for (index in products){
//         var label = products[index].name;
//         var desc = data[label + '_product_description'];
//
//         if(desc!=""){
//             product_list = Object.keys(product_section).map(function (key) {
//                 var ref = label + '_' + product_section[key].name;
//                 var val = data[ref];
//                 return {name:product_section[key].text, value:val, url:'/which_products'}
//             });
//         }
//     }
//
//     res.render('summary', {
//         business,
//         reason,
//         product_list,
//         contacts
//     });
// });
router.get('/summary', function (req, res) {
    res.render('summary', {values: req.session.data});
});
router.post('/summary', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('summary');
});

router.post('/submit', async function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    console.log('final data = ',req.session.data);
    try {
        const {id,ref} = await save_to_cma_db(req.session.data,req);
        // const file_name = req.session.data.filename;



        // }catch(err){
        //     throw 'S3 upload Error: '+ err.toString()+req.session.data.evidence_url;
            // res.render('error', {content: {error: {message: "Internal server error"}}});
        // }
        // console.log('transfer?',transfer_file, file_name);
        // console.log(res);
        //     var copy_params = {
        //     CopySource: 'test-upload-liz' + '/' + '1586170025391',
        //     Bucket: 'test-upload-liz/new',
        //     Key: ref
        // };

        // const isObject = s3bucket.get

        // s3bucket.copyObject(copy_params, function(err, data) {
        //     if (err) console.log(err, err.stack); // an error occurred
        //     else     console.log(data);           // successful response
        // });
        // s3bucket.deleteObject(delete_params, function(err, data) {
        //     if (err) console.log(err, err.stack); // an error occurred
        //     else     console.log(data);           // successful response
        // });
        res.redirect('/confirm/'+ref);
    }
    catch (err){
        console.log('Failed to save to database',err.toString());
        res.render('error', { content : {error: {message: "Internal server error"}}});
    }
});

router.get('/which_products', function (req, res) {
   res.render(
       'which_products',
       {
           values: req.session.data,
           food_products,
           medical_products,
           hygiene_products
       });

});
router.post('/which_products',
    [ ...validate_pack_sizes(body),  ... validate_expected_price(body), ...validate_names(body),body(['product','other_product']).custom((value,{req}) => {
        if(!req.body.other_product && !req.body.product) {
            throw new Error('Please select a product or provide details in the "Other product" category');
        }
        return true;
    })  ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/where_was_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                errorSummary = errorSummary.filter((a)=>a.id!=='product');

                console.log('found errors in validation');
                try {
                    response.render('which_products', {
                        // reports,
                        food_products,
                        hygiene_products,
                        medical_products,
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);
router.get('/what_is_business_url', function (req, res) {
    res.render('what_is_business_url',{values: req.session.data});
});
router.post('/what_is_business_url',
    [ 
        body('business-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the name of the business.'),
        body('website')
        .exists()
        .not().isEmpty().withMessage('Please provide the url for the business in question.'),
        body('business-email').if(body('business-email').notEmpty())
            .isEmail().withMessage('Enter an email address in the correct format, like name@example.com')],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/when_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('what_is_business_url', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);
router.get('/where_was_behaviour', function (req, res) {
    res.render('where_was_behaviour', {values: req.session.data});
});
router.post('/where_was_behaviour',
    [ body('other_location').custom((value,{req}) => {
        if (req.body['is-online']==='other'&&!req.body['other_location']){
            throw new Error('Please specify where you saw the unfair behaviour');
        }
        return true;
    }),
        body('is-online')
        .exists()
        .not().isEmpty().withMessage('Please indicate where the behaviour was observed.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                const location = request.session.data['is-online'];
                if(location==='true') {
                    response.redirect('/what_is_business_url');
                }
                else {
                    response.redirect('/where_is_business');

                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {
                    response.render('where_was_behaviour', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

router.get('/more_information', function (req, res) {
    console.log(req.session.data)
    res.render('more_information', {values: req.session.data});
});
router.post('/more_information',
    [ body('more-info')
        .exists()
        .not().isEmpty().withMessage('Please indicate whether you are happy to provide your contact details.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                const more_info = request.session.data['more-info'];
                if(more_info === 'true'){
                    response.redirect('/contact_details');
                }
                else {
                    response.redirect('/summary');
                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('more_information', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);
router.get('/evidence', function (req, res) {
    res.render('evidence', {values: req.session.data});
});
router.post('/evidence',
    [ body('evidence')
        .exists()
        .not().isEmpty().withMessage('Please indicate whether you have evidence to support your report.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                if(request.session.data.evidence==='true'){
                    response.redirect('/file_upload')
                }
                else {
                    response.redirect('/more_information');
                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('evidence', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

router.get('/when_behaviour', function (req, res) {
    res.render('when_behaviour', {values: req.session.data});
});
router.post('/when_behaviour',
    [ body('date-day').custom((value,{req}) => {
        if (isNaN(req.body['date-day'])||req.body['date-day']>31 ||req.body['date-day']<1) {
            throw new Error('Enter a valid day of the report');
        }
        if (!req.body['date-year']){
            throw new Error('Enter the year of the report');
        }
        return true;
    }),
        body('date-month').custom((value,{req}) => {
            if (isNaN(req.body['date-month'])||req.body['date-month']>12 ||req.body['date-month']<1) {
                throw new Error('Enter a valid month of the report');
            }
            if (!req.body['date-year']){
                throw new Error('Enter the year of the report');
            }
            return true;
        }),
        body('date-year').custom((value,{req}) => {
            if (isNaN(req.body['date-year'])||req.body['date-year']==='') {
                throw new Error('Enter a valid month of the report');
            }
            if (req.body['date-year']<2020 ) {
                throw new Error('Enter a date since the COVID 19 outbreak');
            }
            if (!req.body['date-year']){
                throw new Error('Enter the year of the report');
            }
            return true;
        }),

        body(['date']).custom((value,{req}) => {

            moment.tz.setDefault("Europe/London");
            const today = new moment().startOf('day');
            const date_obj = { year : Number(req.body['date-year']), month : Number(req.body['date-month'])-1, day : Number(req.body['date-day']) };
            const date = new moment.tz(date_obj,"Europe/London");
            if (req.body['date-year']!==''&&req.body['date-year']<2020) {
                throw new Error('Enter a date since the COVID 19 outbreak');
            }
            if(req.body['date-year']!==''&&!date.isValid()){
                throw new Error('Enter a valid date');
            }

            if (date.isAfter(today)) {
                throw new Error('Enter a date in the past');
            }
            return true;
        })],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/evidence');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    errorSummary = errorSummary.filter((a)=>{console.log(a.id==='date',a.text==='Please enter a date since the COVID 19 outbreak',!(a.id==='date'&& a.text==='Please enter a date since the COVID 19 outbreak'));
                    return !(a.id==='date'&& a.text==='Enter a date since the COVID 19 outbreak')});
                    response.render('when_behaviour', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

router.get('/contact_details', function (req, res) {
    res.render('contact_details', {values: req.session.data});
});
router.post('/contact_details',
    [ 
        body('contact-name')
        .exists()
        .not().isEmpty().withMessage('Please provide your full name.'),
        // check for either email address OR telephone number
        body(['contact-email','contact-number']).custom((value,{req}) => {
            if(!req.body['contact-email'] && !req.body['contact-number']) {
                throw new Error('Please provide an email address or telephone number');
            }
            return true;
        }),
        body('contact-email').if(body('contact-email').notEmpty())
        .isEmail().withMessage('Enter an email address in the correct format, like name@example.com') ],
    async (request, response) => {
        
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/summary');
            }
            else {
                let errorSummary = Object.values(errors);
                // filter summary to remove duplicate with contact-number id
                errorSummary = errorSummary.filter((a)=>a.id!=='contact-number');
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('contact_details', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

router.get('/where_is_business', function (req, res) {
    res.render('where_is_business', {values: req.session.data});
});
router.post('/where_is_business',
    [ body('business-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the name of the business.'),
        body('town-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the town/city of the business.')  ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/when_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    response.render('where_is_business', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);



router.get('/file_upload', function (req, res) {
    res.render('file_upload', {values: req.session.data});
});
var zipFolder = require('zip-folder');

var upload = multer({
    storage: multerS3({
        s3: s3bucket,
        bucket: 'test-upload-liz',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {

            console.log('old name =',file.originalname);
            // const has_session_id = req.cookies['connect.sid'];
            const file_name = req.cookies['connect.sid']?req.cookies['connect.sid'].replace(/[^a-zA-Z0-9]/g, "")+'-'+file.originalname: Date.now().toString()+'-'+file.originalname;
            // req.session.data.filename = file_name;
            console.log('d',file_name.split('.')[1]);
            // if(file_name.split('.')[1]!=='jpg'||file_name.split('.')[1]!=='png'||file_name.split('.')[1]!=='pdf'){
            //     console.log('fail');
            //     res.
            // }
            if(req.session.data){
                req.session.data.filename = file_name;
            }
            else {
                req.session.data = {};
                req.session.data.filename = file_name;
            }
            cb(null, file_name)
        }
    }),
    errorHandling: 'manual',
    fileFilter: function(req, file, cb) {
        const file_name = req.cookies['connect.sid']?req.cookies['connect.sid'].replace(/[^a-zA-Z0-9]/g, "")+'-'+file.originalname: Date.now().toString()+'-'+file.originalname;
        checkFileType(req,file, cb,file_name);
    }
});

const checkFileType = (req,file, cb,file_name) => {
    console.log(file_name);
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    console.log(extname&& mimetype)

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        req.fileValidationError='error liz'
        cb(null, false, new Error('goes wrong on the mimetype'));
    }
};
router.post('/file_upload',
    [upload.single('file-upload')],
    async (request, response) => {
        try {
            // console.log(request.body, request.file.location,request.files, request.cookie, request.fileValidationError);
            // // const file = request.body['file-upload'];
            // await upload.single('file-upload');
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};

                if(request.fileValidationError){
                    let errors = { 'file-upload':
                            { id: 'file-upload',
                                href: '#file-upload',
                                value: undefined,
                                text: 'Please upload a JPG, PDF, PNG or SVG file' } } ;
                    let errorSummary =  [ { id: 'file-upload',
                        href: '#file-upload',
                        value: undefined,
                        text: 'Please upload a JPG, PDF, PNG or SVG file' } ]
                    ;
                    response.render('file_upload', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                }
                else if (!request.file) {
                    let errors = { 'file-upload':
                            { id: 'file-upload',
                                href: '#file-upload',
                                value: undefined,
                                text: 'Please upload a valid file' } } ;
                    let errorSummary =  [ { id: 'file-upload',
                        href: '#file-upload',
                        value: undefined,
                        text: 'Please upload a valid file' } ]
                    ;
                    response.render('file_upload', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                }
                else {
                    request.session.data.evidence_url = request.file.location;
                    response.redirect('/more_information');}
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {

                    response.render('file_upload', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            console.log('ser')
            throw err.toString();
        }
    }
);


router.get('/accessibility', function (req, res) {
    res.render('accessibility', {values: req.session.data});
});

router.get('/privacy', function (req, res) {
  res.render('privacy', {values: req.session.data});
});

router.get('/confirm/:id',function (req, res) {
  res.render("confirm",{id:req.params.id});
})
router.get('/redirect', function (req, res, next) {
    res.render('redirect', {});
});

module.exports = router;
