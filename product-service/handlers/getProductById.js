import booksList from '../data/booksList.json';
import {
    BOOK_NOT_FOUND,
    SOMETHING_WENT_WRONG,
} from '../constants/responseMessages.js';

export const getProductById = async (event) => {
    try {
        const { bookId } = event.pathParameters;
        const foundProduct = booksList.find(book => bookId === book.id) || null;

        if (!foundProduct) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({ error: BOOK_NOT_FOUND })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(foundProduct)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    }
};