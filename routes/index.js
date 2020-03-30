const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');
const {reports,food_products,hygiene_products,medical_products} = require('../lib/constants');


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
router.post('/what_behaviour', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('what_behaviour');
});

router.get('/what_happened', function (req, res) {
    console.log('what happened')
    res.render('what_happened', {
        reports,
        values: req.session.data
    });
});
router.post('/what_happened', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('what_happened');
});
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
router.get('/what_is_business_url', function (req, res) {
    res.render('what_is_business_url', {});
});
router.get('/where_was_behaviour', function (req, res) {
    res.render('where_was_behaviour', {});
});
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

router.post('/where_is_business', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('/where_is_business');
});
router.get('/where_is_business', function (req, res) {
    console.log('where is business',req.session)
    res.render('where_is_business', {values: req.session.data});
});

router.get('/privacy', function (req, res) {
  res.render('privacy', {values: req.session.data});
});

router.get('/confirm/:id',function (req, res) {
  res.render("confirm",{id:req.params.id});
})

router.post('/',
    [   // Q1
        body('report_reason')
           .exists()
           .not().isEmpty().withMessage('Enter the reason for your report'),
        // Q2
        body('company-location')
            .exists()
            .not().isEmpty().withMessage('Please indicate the location of the company the complaint is about.'),
        // Q4
        body('company-sector')
            .exists()
            .not().isEmpty().withMessage('Please indicate the sector of the company the complaint is about.'),
        // Q5
        body('product')
            .exists()
            .not().isEmpty().withMessage('Please give the name of the product.'),
        // Q6
        body('description')
            .exists()
            .not().isEmpty().withMessage('Please give a full description of the issue.'),
        // Q9
        body('evidence')
            .exists()
            .not().isEmpty().withMessage('Please indicate if there is evidence of the issue.'),
        // Q10
        body('contact-email').if(body('contact-email').notEmpty())
            .isEmail().withMessage('Enter an email address in the correct format, like name@example.com'),
    ],
    async (request, response) => {
        try {
            request.session.data = {...request.session.data,...request.body};
            const errors = formatValidationErrors(validationResult(request))
            if (!errors) {
                console.log('no errors in validation');
                try {
                    const ref = await save_to_cma_db(request.body,request);
                    response.redirect('/confirm/'+ref);
                }
                catch (err){
                    console.log('Failed to save to database',err.toString());
                    response.render('error', { content : {error: {message: "Internal server error"}}});
                }
            }
            else {
                let errorSummary = Object.values(errors);
                console.log(errors);
                
                console.log('found errors in validation');
                try {
                    response.render('index', {
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

router.get('/redirect', function (req, res, next) {
    res.render('redirect', {});
});

module.exports = router;
