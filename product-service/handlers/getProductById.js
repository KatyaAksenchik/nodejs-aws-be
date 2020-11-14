import { Client } from 'pg';
import is from 'is_js';

import {
    BOOK_NOT_FOUND,
    SOMETHING_WENT_WRONG,
} from '../constants/responseMessages.js';
import { logIncomeRequestEvent } from '../helpers/logRequestHelper.js';
import { getCorsHeaders } from '../helpers/responseHelper.js';
import { dbOptions } from '../constants/dbOptions.js';

const getBookQuery = `
    SELECT books.id, title, description, price, image, count from books 
    LEFT JOIN stocks ON books.id = stocks.book_id 
    WHERE books.id = $1
`;

export const getProductById = async (event) => {
    logIncomeRequestEvent('getProductById', event);

    const { bookId } = event.pathParameters;
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { rows: books } = await client.query(getBookQuery, [ bookId ]);

        if (is.empty(books)) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ error: BOOK_NOT_FOUND })
            };
        }

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify(books[0])
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    } finally {
        client.end();
    }
};
