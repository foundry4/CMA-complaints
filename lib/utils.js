

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

module.exports = {
    formatValidationErrors,
    createReferenceNumber
}
