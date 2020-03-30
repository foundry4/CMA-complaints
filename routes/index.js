const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');
const {reports,food_products,hygiene_products,medical_products} = require('../lib/constants');
const products = [...food_products,...hygiene_products,...medical_products];


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
  res.render('index', {
    reports
  });
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
               console.log(request.session.data.report_reason);
               if(reason === 'consumer_pricing'|| reason==='business_pricing'){
                   response.redirect('/where_was_behaviour');
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
                    console.log('failed to render page', err.toString())
                }
            }
        } catch (err) {
            throw err.toString();
        }
    }
);



router.get('/what_happened', function (req, res) {
    console.log('what happened')
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

router.post('/summary', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    console.log('final data = ',req.session.data);
});

router.get('/which_products', function (req, res) {
    console.log(food_products,medical_products,hygiene_products)
   try { res.render('which_products', {values: req.session.data, food_products, medical_products, hygiene_products});}
   catch(err){
        console.log('liz',err.toString());
    }
});
router.post('/which_products',
    [ ...validate_pack_sizes(body),  ... validate_expected_price(body) ],
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
                console.log(errors);

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
    res.render('what_is_business_url');
});
router.post('/what_is_business_url',
    [ body('website')
        .exists()
        .not().isEmpty().withMessage('Please provide the url for the business in question.') ],
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
    console.log(req.session.data);
    res.render('where_was_behaviour', {});
});
router.post('/where_was_behaviour',
    [ body('is-online')
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
    res.render('more_information', {});
    
});
router.get('/evidence', function (req, res) {
    res.render('evidence', {values: req.session.data});
});
router.post('/evidence', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('evidence');
});

router.get('/when_behaviour', function (req, res) {
    console.log('when',req.session)
    res.render('when_behaviour', {values: req.session.data});
});
router.post('/when_behaviour', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('when_behaviour');
});


router.post('/contact_details', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('contact_details');
});
router.get('/contact_details', function (req, res) {
    console.log('contact',req.session)
    res.render('contact_details', {values: req.session.data});
});

router.get('/where_is_business', function (req, res) {
    console.log('where is business',req.session)
    res.render('where_is_business', {values: req.session.data});
});
router.post('/where_is_business',
    [ body('business-name')
        .exists()
        .not().isEmpty().withMessage('Please provide the name of the business.'),
        body('postcode')
        .exists()
        .not().isEmpty().withMessage('Please provide the postcode of the business.')  ],
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

