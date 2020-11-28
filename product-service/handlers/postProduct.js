import { Client } from 'pg';

import { getCorsHeaders } from '../helpers/responseHelper.js';
import { logIncomeRequestEvent } from '../helpers/logRequestHelper.js';
import { getValidationError, isExist } from '../helpers/validationsHelper.js';
import { dbOptions } from '../constants/dbOptions.js';
import { insertBookQuery, insertStockQuery } from '../db/sqlQueries.js';
import {
    SOMETHING_WENT_WRONG,
    FETCH_SUCCESS,
    INCORRECT_DATA,
} from '../constants/responseMessages.js';

export const postProduct = async (event) => {
    logIncomeRequestEvent('postProduct', event);

    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { title, description, price, image, count } = JSON.parse(event.body);

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
        await client.query('ROLLBACK');
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    } finally {
        client.end();
    }
};
