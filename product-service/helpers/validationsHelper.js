export const isString = value => toString.call(value) === '[object String]';

export const isNumber = value => Number.isFinite(value);

export const isExist = value => value != null;

const validationRules = {
    'existy': (value) => isExist(value) ? null : 'Not exist',
    'number': (value) => isNumber(value) ? null : 'Not a number',
    'string': (value) => isString(value) ? null : 'Not a string',
};

export const getValidationError = data => {
    let error = '';

    data.forEach(({ value, property, validations })=> {
        validations.forEach(rule => {
            const validationResult = validationRules[rule](value);
            if(isExist(validationResult)) {
                error = `${error} ${property}: ${validationResult}`
            }
        })
    });

    return error || null;
};