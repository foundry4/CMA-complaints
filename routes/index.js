const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');
const formatSummaryData = require('../lib/formatSummaryData');
const {reports,food_products,hygiene_products,medical_products, other_products, business_section, business_reason, contact_section, product_section} = require('../lib/constants');
const products = [...food_products,...hygiene_products,...medical_products, ...other_products];

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
            if(req.body['product']&&req.body['product'].includes(other_products[index].name)&&!req.body[name]) {
                throw new Error('Enter a name for the product the report is about');
            }
            if(req.body[name]&&req.body[name].length>50) {
                throw new Error('Please limit '+other_products[index].text+"'s name to 50 characters");
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
            .isNumeric().withMessage('Enter a valid current price for '+products[index].text)
            .isLength({ min: 0, max:50 }).withMessage('Please limit '+products[index].text+"'s current price to 50 characters"));
        const expected_name = products[index].name+'_expected_price';
        array.push(body(expected_name)
            .if(body(expected_name).notEmpty())
            .isNumeric().withMessage('Enter a valid expected price for '+products[index].text)
            .isLength({ min: 0, max:50 }).withMessage('Please limit '+products[index].text+"'s expected price to 50 characters"));
        const description = products[index].name+'_product_description';
        array.push(body(description)
            .isLength({ min: 0, max:50 }).withMessage('Please limit '+products[index].text+"'s description to 50 characters"));
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
                console.log('found errors in validation');
                try {
                    response.render('what_behaviour', {
                        reports,
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page');
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
        .not().isEmpty().withMessage('Please give a full description of the issue.'),body('description')
        .exists()
        .isLength({ min: 0, max:3500 }).withMessage('Please limit your description to 3500 characters') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request));
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                response.redirect('/where_was_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {
                    response.render('what_happened', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page');
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);

router.get('/summary', function (req, res) {
    try {
    var data = req.session.data;
    let{business, reason, product_list, contacts, other_product, errors, missingProducts, error_end, error_start, show_products} = formatSummaryData(data);
    if (process.env.NODE_ENV !== 'production')   
        console.log('final data123 = ', data, error_end, error_start);

    const displayContacts = data&&data['more-info']?data['more-info']:undefined;
    res.render('summary', {
        business,
        reason,
        missingProducts,
        product_list,
        other_product,
        contacts,
        errors,
        error_end,
        error_start,
        show_products
    });
}
    catch(err){
        console.log('Summary render error');
    }
});

router.post('/summary', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('summary');
});

router.post('/submit', async function (req, res) {
    // req.session.data = {...req.session.data,...req.body};
    var data = req.session.data;
    let{business, reason, product_list, contacts, other_product, errors, missingProducts,error_end,error_start, show_products} = formatSummaryData(data);
    const displayContacts = data&&data['more-info']?data['more-info']:undefined;
    if (process.env.NODE_ENV !== 'production')
        console.log('session', req.body);
    if (req.body.total_errors >0){
        res.render('summary', {
            business,
            reason,
            missingProducts,
            product_list,
            displayContacts,
            other_product,
            contacts,
            error_end,
            error_start,
            show_products,
            errors // In production this should sanitized.
        });
    }else {
        try {
            const ref = await save_to_cma_db(req.session.data, req);
            res.redirect('/confirm/' + ref);
        } catch (err) {
            console.log('Failed to save to database', err.toString());
            res.redirect('/error');
        }
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
    }),
        body('other_product').isLength({ min: 0, max:2000 }).withMessage("Please limit Other product's response to 2000 characters")
    ],
    async (request, response) => {
        try {
            if(!request.session.data){
                request.session.data = {};
            }
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                //oveerride all with undefined and then replace only valid ones
                Object.keys(request.body).map((entry)=>{
                    request.session.data[entry]=undefined;
                });
                    //Save hidden values only for selected products
                if (Array.isArray(request.body.product)){
                    Object.keys(request.body.product).map((item) => {
                        const product_name = request.body.product[item];
                        request.session.data[product_name+'_product_description'] = request.body[product_name+'_product_description'];
                        request.session.data[product_name+'_current_price'] = request.body[product_name+'_current_price'];
                        request.session.data[product_name+'_expected_price'] = request.body[product_name+'_expected_price'];
                        if(product_name&&product_name.indexOf('other_')>-1){
                            request.session.data[product_name+'_product_name'] = request.body[product_name+'_product_name'];
                        }

                    });
                }
                else {
                    const product_name = request.body.product;
                    request.session.data[product_name+'_product_description'] = request.body[product_name+'_product_description'];
                    request.session.data[product_name+'_current_price'] = request.body[product_name+'_current_price'];
                    request.session.data[product_name+'_expected_price'] = request.body[product_name+'_expected_price'];
                    if(product_name&&product_name.indexOf('other_')>-1){
                        request.session.data[product_name+'_product_name'] = request.body[product_name+'_product_name'];
                    }                }

                request.session.data.product = request.body.product?request.body.product:undefined;
                request.session.data.other_product = request.body.other_product?request.body.other_product:undefined;
                response.redirect('/where_was_behaviour');
            }
            else {
                let errorSummary = Object.values(errors);
                errorSummary = errorSummary.filter((a)=>a.id!=='product');

                console.log('found errors in validation');
                try {
                    response.render('which_products', {
                        food_products,
                        hygiene_products,
                        medical_products,
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page')
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
            .not().isEmpty().withMessage('Please provide the name of the business.')
            .isLength({ min: 0, max:200 }).withMessage('Please limit the business name to 200 characters'),
        body('website')
            .exists()
            .not().isEmpty().withMessage('Please provide the url for the business in question.')
            .isLength({ min: 0, max:200 }).withMessage('Please limit the business url to 200 characters'),
        body('business-email').if(body('business-email').notEmpty()).trim()
            .isEmail().withMessage('Enter an email address in the correct format, like name@example.com')
            .isLength({ min: 0, max:200 }).withMessage('Please limit the business email to 200 characters')],
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
                console.log('found errors in validation');
                try {
                    response.render('what_is_business_url', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page')
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);
router.get('/what_is_business_phone', function (req, res) {
    res.render('what_is_business_phone',{values: req.session.data});
});
router.post('/what_is_business_phone',
    [ 
        body('business-name')
            .exists()
            .not().isEmpty().withMessage('Please provide the name of the business.')
            .isLength({ min: 0, max:200 }).withMessage('Please limit the business name to 200 characters'),
            body('telephone').if(body('telephone').notEmpty()).trim()
            .isLength({ min: 0, max:15 }).withMessage('Please limit the telephone number to 15 characters'),
        body('business-email').if(body('business-email').notEmpty()).trim()
            .isEmail().withMessage('Enter an email address in the correct format, like name@example.com')
            .isLength({ min: 0, max:200 }).withMessage('Please limit the business email to 200 characters')],
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
                console.log('found errors in validation');
                try {
                    response.render('what_is_business_phone', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page')
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
        if (req.body['medium']==='other'&&!req.body['other_location']){
            throw new Error('Please specify where you saw the behaviour');
        }
        if (req.body['medium']==='other'&&req.body['other_location']&& req.body['other_location'].length>200){
            throw new Error('Please limit the location to 200 characters');
        }
        return true;
    }),
        body('medium')
        .exists()
        .not().isEmpty().withMessage('Please indicate where the behaviour was observed.') ],
    async (request, response) => {
        try {
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                request.session.data = {...request.session.data,...request.body};
                if(!request.body.other_location){
                    request.session.data.other_location = undefined;
                }
                if(request.body['medium']!=='other'){
                    request.session.data.other_location = undefined;
                }
                const medium = request.session.data['medium'];
                if(medium==='online') {
                    response.redirect('/what_is_business_url');
                }
                if(medium==='telephone') {
                    response.redirect('/what_is_business_phone');
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
                    console.log('failed to render page');
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
                response.redirect('/contact_details');
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation');
                try {
                    response.render('evidence', {
                        errors,
                        errorSummary,
                        values: request.body, // In production this should sanitized.
                    });
                } catch (err) {
                    console.log('failed to render page')
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
                console.log('found errors in validation');
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
            .isLength({ min: 0, max:200 }).withMessage('Please limit your full name to 200 characters'),
        // check for either email address OR telephone numberreturn true;
        body('contact-number').if(body('contact-number').notEmpty())
            .isLength({ min: 0, max:200 }).withMessage('Please limit your contact number to 200 characters'),
        body('contact-email').if(body('contact-email').notEmpty()).trim()
        .isEmail().withMessage('Enter an email address in the correct format, like name@example.com')
            .isLength({ min: 0, max:200 }).withMessage('Please limit your contact email to 200 characters')],
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
                errorSummary = errorSummary.filter((a)=>{
                    if (process.env.NODE_ENV !== 'production')
                        console.log(a.id, a.text);
                    return !(a.id==='contact-number'&&a.text==='Please provide an email address or telephone number');
                });
                // console.log('found errors in validation',errorSummary,errors);
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
    if (process.env.NODE_ENV !== 'production')
        console.log(req.session.data);
    res.render('where_is_business', {values: req.session.data});
});
router.post('/where_is_business',
    [ body('business-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the name of the business.')
        .isLength({ min: 0, max:200 }).withMessage('Please limit the business name to 200 characters'),
    body('town-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the town/city of the business.')
        .isLength({ min: 0, max:200 }).withMessage('Please limit the town/city to 200 characters'),
    body('street-name').if(body('street-name').notEmpty())
        .isLength({ min: 0, max:200 }).withMessage('Please limit the street name to 200 characters'),
    body('county').if(body('county').notEmpty())
        .isLength({ min: 0, max:200 }).withMessage('Please limit the county to 200 characters'),
    body('postcode').if(body('postcode').notEmpty())
        .isLength({ min: 0, max:20 }).matches(/^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/, 'g')
        .withMessage('Please enter a valid postcode or leave the box empty')],
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

router.get('/cookies', function (req, res) {
    res.render('cookies', {values: req.session.data});
});
router.post('/cookies',
    [ body('cookieAccept')
        .exists()
        .not().isEmpty().withMessage('Please choose the cookie settings you prefer.')
    ],
    async (req, res) => {
        try {
            const errors = formatValidationErrors(validationResult(req));
            const cookieAccept = req.body["cookieAccept"];
            if (!errors) {
                if(cookieAccept === '1'){
                    req.app.locals.FATHOM_ID = process.env.FATHOM_ID;
                } else {
                    req.app.locals.FATHOM_ID = null;
                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log('found errors in validation',errorSummary,errors);
                try {
                    res.render('cookies', {
                        errors,
                        errorSummary,
                        values: req.body,
                    });
                } catch (err) {
                    console.log('failed to render page', err.toString());
                }
            }
            req.session["cookieAccept"] = cookieAccept;
            const referer = req.headers["referer"];
            res.redirect(referer);
        } catch (err) {
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

//
// [ { id: 'website',
//     href: '#website',
//     value: '',
//     text: 'Please provide the url of the business in question.' } ] errors= { website:
//         { id: 'website',
//             href: '#website',
//             value: '',
//             text: 'Please provide the url of the business in question.' } }
//
//
// found errors in validation [ { id: 'description',
//     href: '#description',
//     value: '',
//     text: 'Please give a full description of the issue.' } ] { description:
// { id: 'description',
//     href: '#description',
//     value: '',
//     text: 'Please give a full description of the issue.' } }

