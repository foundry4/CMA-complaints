const { reports, food_products, other_products,hygiene_products, medical_products, business_section, business_reason, contact_section, product_section } = require('../lib/constants');
const full_food_products = [...food_products, other_products[0]];
const full_medical_products = [...medical_products, other_products[1]];
const full_hygiene_products = [...hygiene_products, other_products[2]];
const addToProductList = require('../lib/utils').addToProductList;
module.exports = (data) => {
    try {
        // loop through each of hte different section (in constants)
        // build a list of rows to check in the summary
        var errorClass = '';
        let total_errors = 0;
        // loop through the business
        var business;
        if(data&&data['is-online']!==undefined) {
            business = Object.keys(business_section).map(function (key) {
                var val = data[key];
                errorClass = '';
                var url = business_section[key].url;

                if (key === 'is-online') {
                    if (val === 'true') val = 'Yes';
                    if (val === 'false') val = 'No';
                    if (val === 'other') val = data['other_location'];
                }
                if (key === 'business-name' && (data['is-online'] === 'true')) {
                    url = '/what_is_business_url';
                }
                if (key === 'location') {
                    if (data['is-online'] === 'true') {
                        val = data['website'];
                        if (data['business-email']) val += ', ' + data['business-email'];
                        url = '/what_is_business_url';
                    } else {
                        var temp = [];
                        if (data['street-name']) temp.push(data['street-name']);
                        if (data['town-name']) {
                            temp.push(data['town-name'])
                        } else {
                            console.log('town error')
                            temp.push('Missing data');
                            total_errors++;
                            errorClass = 'govuk-error-message';
                        }
                        ;
                        if (data['county']) temp.push(data['county']);
                        if (data['postcode']) temp.push(data['postcode']);
                        val = temp.join(', ');
                    }
                }
                if (val === '' || val === null || val === undefined) {
                    val = 'Missing data';
                    total_errors++;
                    console.log(key, ' error');
                    errorClass = 'govuk-error-message';
                }
                var row = {
                    key: {
                        text: business_section[key].text
                    },
                    value: {
                        text: val,
                        classes: errorClass
                    },
                    actions: {
                        items: [
                            {
                                href: url,
                                text: 'Change',
                                visuallyHiddenText: business_section[key].text
                            }
                        ]
                    }
                }

                return row
            });
        }
        else {
            console.log('online error')
            total_errors++;
        }

        // loop through the reasons
        var reason;
        if(data&&data['report_reason']!==undefined) {
            var date = data['date-day'] + '/' + data['date-month'] + '/' + data['date-year'];

            reason = Object.keys(business_reason).map(function (key) {
                var val = data[key];
                errorClass = '';
                if (key === 'date') {
                    if (!data['date-day'] || !data['date-month'] || !data['date-year']) {
                        date = 'Missing data';
                        errorClass = 'govuk-error-message';
                        total_errors++;
                        console.log('day error');
                    }
                    val = date;
                }
                if (key === 'evidence') {
                    if (val === 'true') val = 'Yes';
                    else if (val === 'false') val = 'No';
                    else {
                        val = ''
                        total_errors++;
                    }
                    console.log('evidence error')
                }
                if (key === 'report_reason') {
                    for (var i = 0; i < reports.length; i++) {
                        if (reports[i].name == data[key]) {
                            val = reports[i].text;
                        }
                    }
                }

                if (val === '' || val === null || val === undefined) {
                    val = 'Missing data';
                    // total_errors++;
                    errorClass = 'govuk-error-message';
                    // console.log(key, ' errora')
                }
                // check for description if NOT product pricing
                if (key === 'description') {
                    console.log(data['report_reason'] === undefined ,data['report_reason'].indexOf('pricing') === -1)
                    if ( data['report_reason'].indexOf('pricing') ===-1) {
                        if(!data['description']) {
                            val = 'Missing data';
                            errorClass = 'govuk-error-message';
                            total_errors++;
                            console.log(key, ' errors')
                        }
                    } else {
                        return null // no line
                    }
                }


                var row = {
                    key: {
                        text: business_reason[key].text
                    },
                    value: {
                        text: val,
                        classes: errorClass
                    },
                    actions: {
                        items: [
                            {
                                href: business_reason[key].url,
                                text: 'Change',
                                visuallyHiddenText: business_reason[key].text
                            }
                        ]
                    }
                }
                return row
            });
        } else {
            console.log('report error')
            total_errors++;
        }

        // loop through the contacts
        var contacts;
        if (data && data['more-info']) {
            contacts= [];
            if (data['more-info'] === 'true') {
                if(data['contact-email']||data['contact-number']){
                    contacts = Object.keys(contact_section).map(function (key) {
                        var val = data[key];
                        errorClass = '';
                        if (key === 'more-info') {
                            if (val === 'true') val = 'Yes';
                            if (val === 'false') val = 'No';
                        }
                        var row = {
                            key: {
                                text: contact_section[key].text
                            },
                            value: {
                                text: val,
                                classes: errorClass
                            },
                            actions: {
                                items: [
                                    {
                                        href: contact_section[key].url,
                                        text: 'Change',
                                        visuallyHiddenText: contact_section[key].text
                                    }
                                ]
                            }
                        }
                        return row
                    });
                }
                else {
                    console.log('contact details missing rroe')
                    total_errors++;
                    contacts = [
                        {
                            key: {
                                text: 'May we contact you?'
                            },
                            value: {
                                text: 'Yes',
                            },
                            actions: {
                                items: [
                                    {

                                        href: '/more_information',
                                        text: 'Change',
                                        visuallyHiddenText: 'more information'
                                    }
                                ]
                            }
                        },
                        {
                            key: {
                                text: 'Contact details'
                            },
                            value: {
                                text: 'Missing data',
                                classes: 'govuk-error-message'
                            },
                            actions: {
                                items: [
                                    {

                                        href: '/contact_details',
                                        text: 'Change',
                                        visuallyHiddenText: 'contact details'
                                    }
                                ]
                            }
                        }
                    ];
                }
            } else {
                if (data['more-info'] === 'false') {
                    val = 'No';
                    errorClass = '';
                } else {
                    total_errors++;
                    console.log('error for mor-info')
                    val = 'Missing data';
                    errorClass = 'govuk-error-message';
                }
                contacts = [
                    {
                        key: {
                            text: 'May we contact you?'
                        },
                        value: {
                            text: val,
                            classes: errorClass
                        },
                        actions: {
                            items: [
                                {

                                    href: '/more_information',
                                    text: 'Change',
                                    visuallyHiddenText: 'contact details'
                                }
                            ]
                        }
                    }
                ];
            }
        }
        else {
            console.log('contact error')
            total_errors++;
        }

        var product_list = [];
        // loop through the products
        addToProductList(full_food_products,data,product_section,product_list);
        addToProductList(full_hygiene_products,data,product_section,product_list);
        addToProductList(full_medical_products,data,product_section,product_list);

        const other_product =data && data['other_product']?[{
            key: {
                text: 'Other Product'
            },
            value: {
                text: data['other_product']
            },
            actions: {
                items: [
                    {
                        href: '/which_products',
                        text: 'Change',
                        visuallyHiddenText: 'other_product'
                    }
                ]
            }
        }]:undefined;
        console.log('after summary = ',business, reason, product_list, contacts, total_errors);
        return { business, reason, product_list, contacts,other_product, total_errors };

    }
catch(err){
        console.log('error in summary', err.toString())
    }
}