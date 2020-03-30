let sessionDataDefaults = {}
const getKeypath = require('keypather/get')

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
var storeData = function (input, data) {

    for (var i in input) {
        // any input where the name starts with _ is ignored
        if (i.indexOf('_') === 0) {
            continue
        }

        var val = input[i]

        // Delete values when users unselect checkboxes
        if (val === '_unchecked' || val === ['_unchecked']) {
            delete data[i]
            continue
        }

        // Remove _unchecked from arrays of checkboxes
        if (Array.isArray(val)) {
            var index = val.indexOf('_unchecked')
            if (index !== -1) {
                val.splice(index, 1)
            }
        } else if (typeof val === 'object') {
            // Store nested objects that aren't arrays
            if (typeof data[i] !== 'object') {
                data[i] = {}
            }

            // Add nested values
            storeData(val, data[i])
            continue
        }
console.log('saving, ',input,data)
        data[i] = val
    }
}


autoStoreData = function (req, res, next) {
    if (!req.session.data) {
        req.session.data = {}
    }
    req.session.data['eventful2'] = 'bob'
// console.log('saving',req)
    storeData(req.body, req.session.data)
    console.log(req.body, 'l');
    storeData(req.query, req.session.data)

    // Send session data to all views

    res.locals.data = {}

    for (var j in req.session.data) {
        res.locals.data[j] = req.session.data[j]
    }

    next()
}

addCheckedFunction = function (env) {
    env.addGlobal('checked', function (name, value) {
        // Check data exists
        if (this.ctx.data === undefined) {
            return ''
        }

        // Use string keys or object notation to support:
        // checked("field-name")
        // checked("['field-name']")
        // checked("['parent']['field-name']")
        name = !name.match(/[.[]/g) ? `['${name}']` : name
        var storedValue = getKeypath(this.ctx.data, name)

        // Check the requested data exists
        if (storedValue === undefined) {
            return ''
        }

        var checked = ''

        // If data is an array, check it exists in the array
        if (Array.isArray(storedValue)) {
            if (storedValue.indexOf(value) !== -1) {
                checked = 'checked'
            }
        } else {
            // The data is just a simple value, check it matches
            if (storedValue === value) {
                checked = 'checked'
            }
        }
        return checked
    })
}

module.exports = {
    autoStoreData,
    formatValidationErrors,
    createReferenceNumber,
    addCheckedFunction
}
