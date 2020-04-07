const { reports, food_products, hygiene_products, medical_products, business_section, business_reason, contact_section, product_section } = require('../lib/constants');
const products = [...food_products, ...hygiene_products, ...medical_products];

module.exports = (data) => {
    // loop through each of hte different section (in constants)
    // build a list of rows to check in the summary
    
    // loop through the business
    var business = Object.keys(business_section).map(function (key) {
        var val = data[key];
        var url = business_section[key].url;

        if (key === 'is-online') {
            val = (val === 'true') ? "Yes" : "No";
        }
        if (key === 'business-name' && (data['is-online'] === 'true')) {
            url = '/what_is_business_url';
        }
        if (key == 'location') {
            if (data['is-online'] === 'true') {
                val = data['website'] + '<br>' + data['business-email'];
                url = '/what_is_business_url';
            } else {
                val = "";
                if (data['street-name']) val += data['street-name'];
                if (data['town-name']) val += '<br/>' + data['town-name'];
                if (data['county']) val += '<br/>' + data['county'];
                if (data['postcode']) val += '<br/>' + data['postcode'];
            }
        }
        var row   = {
            key: {
              text: business_section[key].text
            },
            value: {
              text: val
            },
            actions: {
              items: [
                {
                  href: url,
                  text: "Change",
                  visuallyHiddenText: business_section[key].text
                }
              ]
            }
          }

        return row
     });

    // loop through the reasons
    var date = data['date-day'] + " " + data['date-month'] + " " + data['date-year'];
    var reason = [];
    reason = Object.keys(business_reason).map(function (key) {
        var val = data[key];

        if (key === 'date') {
            val = date;
        }
        if (key === 'evidence') {
            val = (val === 'true') ? "Yes" : "No";
        }
        if (key === 'report_reason') {
            for (var i = 0; i < reports.length; i++) {
                if (reports[i].name == data[key]) {
                    val = reports[i].text;
                }
            }

        }
        var row   = {
            key: {
              text: business_reason[key].text
            },
            value: {
              text: val
            },
            actions: {
              items: [
                {
                  href: business_reason[key].url,
                  text: "Change",
                  visuallyHiddenText: business_reason[key].text
                }
              ]
            }
          }
          return row
    });

    // loop through the contacts
    var contacts = [];
    if (data['more-info'] === 'true') {
        contacts = Object.keys(contact_section).map(function (key) {
            var val = data[key];
            if (key === 'more-info') {
                val = (val === 'true') ? "Yes" : "No";
            }
            var row   = {
                key: {
                  text: contact_section[key].text
                },
                value: {
                  text: val
                },
                actions: {
                  items: [
                    {
                      href: contact_section[key].url,
                      text: "Change",
                      visuallyHiddenText: contact_section[key].text
                    }
                  ]
                }
              }
              return row
        });
    }

    var product_list = [];
    
        // loop through the products ARRAY
        for (index in products){
            var label = products[index].name;
            var text = products[index].text;
    
            //loop through the actual data to find matching entries
            if(data['product'] && data['product'].indexOf(label) > -1){
                    var rows = Object.keys(product_section).map(function (key) {
                    var ref = label + '_' + product_section[key].name;
                    var val = data[ref];
                    return {name:product_section[key].text, value:val}
                });
                product_list.push({name:text, rows:rows, url:'/which_products'})
            }
        }
    //console.log(product_list);
    
    return { business, reason, product_list, contacts };

}