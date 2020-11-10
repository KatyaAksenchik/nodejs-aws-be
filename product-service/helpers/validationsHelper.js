export const isString = value => toString.call(value) === '[object String]';

export const isNumber = value => Number.isFinite(value);

export const isExist = value => value != null;

const validationRules = {
    'existy': (value) => isExist(value) ? null : 'Not exist',
    'number': (value) => isNumber(value) ? null : 'Not a number',
    'string': (value) => isString(value) ? null : 'Not a string',
};

export const getValidationError = data => {
    const validationResults = data.flatMap(({value, property, validations}) => {
        const validators = validations.map(rule => ({ rule, validate: validationRules[rule]}));
        return validators.map(validator => ({ property, value, error: validator.validate(value) }));
    });

    const errorResults = validationResults.filter(result => isExist(result.error));
    const error = errorResults.map(({property, error}) => `${ property }: ${ error }`).join(' ');

    return error || null;
};