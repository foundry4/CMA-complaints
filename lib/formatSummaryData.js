const {reports,food_products,hygiene_products,medical_products, business_section, business_reason, contact_section, product_section} = require('../lib/constants');
const products = [...food_products,...hygiene_products,...medical_products];

module.exports = (data)=>{

        // loop through the business
    var business = Object.keys(business_section).map(function (key) { 
        var val = data[key];
        var url = business_section[key].url;
        if(key=='location'){
            if( data['is-online'] ){
                val = data['website'] +'<br>' + data['business-email'];
                // update url
                url ='/what_is_business_url';
            }else{
                val = data['street-name'];
                val += '<br/>' + data['town-name'];
                val += '<br/>' + data['postcode'];
            } 
        } 
        return {name:business_section[key].text, value:val, url:url} 
    });

    // loop through the reasons
    var date = data['date-day'] + " "+ data['date-month']+ " "+ data['date-year'];
    var reason = Object.keys(business_reason).map(function (key) { 
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
        return {name:contact_section[key].text, value:data[key], url:contact_section[key].url} 
    });

    // loop through the products ARRAY
    var product_list =[];
    
    for (index in products){
        var label = products[index].name;
        var desc = data[label + '_product_description'];

        if(desc!=""){
            product_list = Object.keys(product_section).map(function (key) { 
                var ref = label + '_' + product_section[key].name;
                var val = data[ref];
                return {name:product_section[key].text, value:val, url:'/which_products'} 
            }); 
        }
    }

    return {business, reason, product_list, contacts};
}