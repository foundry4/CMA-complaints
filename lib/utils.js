// To make it easier to use in the view, format express-validator errors.
function formatValidationErrors (errorsInstance) {
    if (errorsInstance.isEmpty()) {
        return false
    }
    const errors = errorsInstance.array()
    const formattedErrors = {}
    errors.forEach(error => {
        formattedErrors[error.param] = {
            id: error.param,
            href: '#' + error.param,
            value: error.value,
            text: error.msg
        }
    })
    return formattedErrors
}

function createReferenceNumber(id){
    if(id>Math.pow(10,8)){
        return 'INVALID_REFERENCE';
    }
    else {
        id = ("00000000"+id).slice(-8);
        return 'CMA'+id;
    }
}

function addToProductList(products,data,product_section,product_list){
    for (let index in products) {
        var label = products[index].name;
        var text = products[index].text;

        //loop through the actual data to find matching entries
        if (data &&data['product'] && data['product'].indexOf(label) > -1) {
            var rows = Object.keys(product_section).map(function (key) {
                var ref = label + '_' + product_section[key].name;
                var val = data[ref];
                if(label.indexOf('other_')===-1){
                    if(key.indexOf('name')===-1){
                        return {name: product_section[key].text, value: val}
                    }
                }
                else {
                    return {name: product_section[key].text, value: val}
                }
            });
            console.log('rows = ',rows.filter((a)=>a))
            product_list.push({name: text, rows: rows, url: '/which_products'})
        }
    }
}
module.exports = {
    formatValidationErrors,
    createReferenceNumber,
    addToProductList
}
