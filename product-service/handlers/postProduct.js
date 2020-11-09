import { Client } from 'pg';

import { getCorsHeaders } from '../helpers/responseHelper.js';
import { logIncomeRequestEvent } from '../helpers/logRequestHelper.js';
import { getValidationError, isExist } from '../helpers/validationsHelper.js';
import { dbOptions } from '../constants/dbOptions.js';
import {
    SOMETHING_WENT_WRONG,
    FETCH_SUCCESS,
    INCORRECT_DATA,
} from '../constants/responseMessages.js';

const insertBookQuery = `
    INSERT INTO books (title, description, price, image) VALUES ($1, $2, $3, $4) RETURNING id
`;

const insertStockQuery = `
    INSERT INTO stocks (book_id, count) VALUES ($1, $2)
`;

export const postProduct = async (event) => {
    logIncomeRequestEvent('postProduct', event);

    const { title, description, price, image, count } = JSON.parse(event.body);

    const client = new Client(dbOptions);
    await client.connect();

    try {
        const validationError = getValidationError([
            {
                property: 'description',
                value: description,
                validations: ['existy', 'string'],
            },
            {
                property: 'title',
                value: title,
                validations: ['existy', 'string'],
            },
            {
                property: 'image',
                value: image,
                validations: ['existy', 'string'],
            },
            {
                property: 'price',
                value: price,
                validations: ['existy', 'number'],
            },
            {
                property: 'count',
                value: count,
                validations: ['existy', 'number'],
            },
        ]);

        if(isExist(validationError)) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ message: `${INCORRECT_DATA}:: ${validationError}` })
            }
        }

        await client.query('BEGIN');

        const { rows: book } = await client.query(insertBookQuery, [title, description, price, image]);
        const { id } = book[0];

        await client.query(insertStockQuery, [id, count]);

        await client.query('COMMIT');

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({ message: FETCH_SUCCESS })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    } finally {
        await client.query('ROLLBACK');
        client.end();
    }
};
