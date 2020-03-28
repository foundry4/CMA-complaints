const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');

const {reports,food_products,hygiene_products,medical_products} = require('../lib/constants');


// GET home page
router.get('/', function (req, res, next) {
  try {
      res.render('index', {
          reports,
          food_products,
          hygiene_products,
          medical_products
      });
  }
  catch(err){console.log(err.toString())}
});

router.get('/privacy', function (req, res) {
  res.render('privacy', {});
});

router.get('/confirm/:id',function (req, res) {
  res.render("confirm",{id:req.params.id});
})

const validate_pack_sizes =(body)=>{
    const array = [];
    for (index in food_products){
        const name = food_products[index].name+'_pack_size';
        array.push(body(name)
            .if(body(name).notEmpty())
            .isInt().withMessage('Enter a valid pack size'));
    }
    return array;
}

const validate_expected_price =(body)=>{
    const array = [];
    for (index in food_products){
        const current_name = food_products[index].name+'_current_price';
        array.push(body(current_name)
            .if(body(current_name).notEmpty())
            .isNumeric().withMessage('Enter a valid curent price'));
        const expected_name = food_products[index].name+'_expected_price';
        array.push(body(expected_name)
            .if(body(expected_name).notEmpty())
            .isNumeric().withMessage('Enter a valid expected price'));
    }
    return array;
}

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
        body('product').exists()
            .not().isEmpty().withMessage('Please indicate at least one product which the complaint is about.'),
        body('pasta_pack_size').if(body('pasta_pack_size').notEmpty())
            .isInt().withMessage('Please enter a valid pack size'),
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
        // new q8
        ...validate_pack_sizes(body),
        ... validate_expected_price(body)
    ],
    async (request, response) => {
        try {
            console.log('json body = ', request.body);
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

router.get('/redirect', function (req, res, next) {
    res.render('redirect', {});
});

module.exports = router;
