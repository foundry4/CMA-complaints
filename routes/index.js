const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const { formatValidationErrors } = require('../lib/utils');
const save_to_cma_db = require('../lib/save_to_cma_db');
const {reports,food_products,hygiene_products,medical_products, business_section, business_reason, contact_section, product_section} = require('../lib/constants');
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

router.get('/summary', function (req, res) {
    var data = req.session.data;
    console.log(data);



/*     
    var data =  { description: ' describe the behaviour you are reporting, such as in what way the business is making misleading claims. Do not include personal or financial information, like your credit card details. ',
    'expiry-day': '28',
    'expiry-month': '3',
    'expiry-year': '2020',
    'contact-name': 'Mr X',
    'contact-email': 'x@y.com',
    'more-info': true,
    'contact-number': '01743 875656',
    'business-name': 'organisation x',
    'street-name': 'street',
    'town-name': 'emmerdale',
    'report_reason':'cancellation',
    county: '',
    postcode: 'm13 9pl' };
      */

    // loop through the business
    var business = Object.keys(business_section).map(function (key) { 
        console.log(key);
        return {name:business_section[key].text, value:data[key], url:business_section[key].url} 
    });
    // loop through the reasons
    var date = data['expiry-day'] + " "+ data['expiry-month']+ " "+ data['expiry-year'];
    var reason = Object.keys(business_reason).map(function (key) { 
        console.log(key);
        var val = data[key];
        if (key === 'date'){
            val = date;
        }
        if (key === 'report_reason' ){
            if(data['reason_other']){
                val = data[key];
            }else{   

                for (var i = 0; i < reports.length; i++) {
                    if (reports[i].name == data[key]) {
                        val = reports[i].text;
                    }
                }
            }

        }
        return {name:business_reason[key].text, value:val, url:business_reason[key].url} 
    });

    // loop through the contacts
    var contacts = Object.keys(contact_section).map(function (key) { 
        console.log(key);
        return {name:contact_section[key].text, value:data[key], url:contact_section[key].url} 
    });


    
    console.log(contacts);
    
    res.render('summary', {
        business,
        reason,
        contacts
    });
});

router.post('/summary', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    console.log('final data = ',req.session.data);
    res.redirect('summary');
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
    res.render('what_is_business_url', {});
});
router.post('/where_was_behaviour', function (req, res) {
    req.session.data = {...req.session.data,...req.body};
    res.redirect('where_was_behaviour');
});
router.get('/where_was_behaviour', function (req, res) {
    console.log(req.session.data);
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
router.get('/redirect', function (req, res, next) {
    res.render('redirect', {});
});

module.exports = router;
