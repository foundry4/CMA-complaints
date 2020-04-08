const { reports, food_products, hygiene_products, medical_products, business_section, business_reason, contact_section, product_section } = require('../lib/constants');
const products = [...food_products, ...hygiene_products, ...medical_products];

module.exports = (data) => {
    try {
        // loop through each of hte different section (in constants)
        // build a list of rows to check in the summary
        var errorClass = '';
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
                }
                if (key === 'business-name' && (data['is-online'] === 'true')) {
                    url = '/what_is_business_url';
                }
                if (key == 'location') {
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
                            temp.push('Missing data');
                            errorClass = 'govuk-error-message';
                        }
                        ;
                        if (data['county']) temp.push(data['county']);
                        if (data['postcode']) temp.push(data['postcode']);
                        val = temp.join(', ');
                    }
                }
                if (val === '' || val === null) {
                    val = 'Missing data';
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
                    }
                    val = date;
                }
                if (key === 'evidence') {
                    if (val === 'true') val = 'Yes';
                    if (val === 'false') val = 'No';
                }
                if (key === 'report_reason') {
                    for (var i = 0; i < reports.length; i++) {
                        if (reports[i].name == data[key]) {
                            val = reports[i].text;
                        }
                    }
                }
                console.log(val);

                if (val === '' || val === null) {
                    val = 'Missing data';
                    errorClass = 'govuk-error-message';
                }
                // check for description if NOT product pricing
                if (key === 'description') {
                    if (data['report_reason'] === undefined || data['report_reason'].indexOf('pricing') == -1) {
                        val = 'Missing data';
                        errorClass = 'govuk-error-message';
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
        }

        // loop through the contacts
        var contacts = [];
        if (data&&data['more-info'] === 'true') {
            contacts = Object.keys(contact_section).map(function (key) {
                var val = data[key];
                errorClass = '';
                if (val === '') {
                    val = 'Missing data';
                    errorClass = 'govuk-error-message';

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
        } else {
            contacts = [
                {
                    key: {
                        text: 'May we contact you?'
                    },
                    value: {
                        text: 'No',
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

        var product_list = [];
        // loop through the products ARRAY
        for (index in products) {
            var label = products[index].name;
            var text = products[index].text;

            //loop through the actual data to find matching entries
            if (data &&data['product'] && data['product'].indexOf(label) > -1) {
                var rows = Object.keys(product_section).map(function (key) {
                    var ref = label + '_' + product_section[key].name;
                    var val = data[ref];
                    return {name: product_section[key].text, value: val}
                });
                product_list.push({name: text, rows: rows, url: '/which_products'})
            }
        }
        console.log('after summary = ',business, reason, product_list, contacts);
        return { business, reason, product_list, contacts };

    }
catch(err){
        console.log('error in summary', err.toString())
    }
}