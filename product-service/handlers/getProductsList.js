import { Client } from 'pg';
import { SOMETHING_WENT_WRONG } from '../constants/responseMessages.js';
import { getCorsHeaders } from '../helpers/responseHelper.js';
import { dbOptions } from '../constants/dbOptions.js';

const getBooksQuery = `
    SELECT books.id, title, description, price, imageurl, count from books 
    LEFT JOIN stocks ON books.id = stocks.book_id
`;

export const getProductsList = async () => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const { rows: booksList } = await client.query(getBooksQuery);

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify(booksList)
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
