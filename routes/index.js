const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator')
const { formatValidationErrors } = require('../lib/utils');
const save_to_companies_db = require('../lib/save_to_companies_db');
var {devices, expertise, resources} = require('../lib/constants');


// GET home page
router.get('/', function (req, res, next) {
  res.render('index', {
      devices: devices,
      expertise: expertise,
      resources: resources
  });
});

router.get('/privacy', function (req, res, next) {
  res.render('privacy', {});
});

router.get('/confirm',function (req, res, next) {
    console.log('hitting confirm');
    res.render("confirm");
})

router.post('/',
    [
        body('organisation-name')
            .exists()
            .not().isEmpty().withMessage('Enter the name of your organisation'),
        body('primary-contact')
            .exists()
            .not().isEmpty().withMessage('Enter the name of the primary contact'),
        body('primary-contact-role')
            .exists()
            .not().isEmpty().withMessage('Enter the primary contact\'s role'),
        body('phone')
            .exists()
            .not().isEmpty().withMessage('Enter your telephone number'),
        body('email')
            .exists()
            .not().isEmpty().withMessage('Please enter your email address'),
        body('is-clinical')
            .exists()
            .not().isEmpty().withMessage('Please state if you produce regulated ventilators'),
        body('human-use')
            .exists()
            .not().isEmpty().withMessage('Please state if you have made parts for human use'),
        body('vet-use')
            .exists()
            .not().isEmpty().withMessage('Please state if you have made parts for veterinary use'),
        body('other-use')
            .exists()
            .not().isEmpty().withMessage('Please state if you have made parts for other uses')
    ],
    async (request, response) => {
        try {
            //console.log(request.body,validationResult(request))
            const errors = formatValidationErrors(validationResult(request))
            console.log('found errors in validation')
            if (!errors) {
                console.log('no errors in validation');
                try {
                    await save_to_companies_db(request.body,request);
                    response.redirect('/confirm');
                }
                catch (err){
                    console.log('Failed to save to database',err.toString());
                    response.render('error', { content : {error: {message: "Internal server error"}}});
                }
            }
            else {
                let errorSummary = Object.values(errors);
                try {
                    response.render('index', {
                        devices: devices,
                        expertise: expertise,
                        resources: resources,
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
