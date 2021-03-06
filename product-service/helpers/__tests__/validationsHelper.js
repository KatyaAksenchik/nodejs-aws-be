import { getValidationError } from '../validationsHelper.js';

describe('get Validation Error', () => {
    test('all fields are valid', () => {
        const data = [
            {
                property: 'image',
                value: 'AAA',
                validations: ['existy', 'string'],
            },
            {
                property: 'price',
                value: 10,
                validations: ['existy', 'number'],
            },
        ];

        expect(getValidationError(data)).toBeNull();
    });

    test('one field is not valid', () => {
        const data = [
            {
                property: 'image',
                value: 'AAA',
                validations: ['existy', 'string'],
            },
            {
                property: 'price',
                value: 'AAAA',
                validations: ['existy', 'number'],
            },
        ];

        expect(getValidationError(data)).toBe('price: Not a number');
    });
});
