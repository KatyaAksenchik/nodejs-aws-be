import booksList from '../data/booksList.json';
import {
    BOOK_NOT_FOUND,
    SOMETHING_WENT_WRONG,
} from '../constants/responseMessages.js';
import { getCorsHeaders } from '../helpers/responseHelper.js';

export const getProductById = async (event) => {
    try {
        const { bookId } = event.pathParameters;
        const foundProduct = booksList.find(book => bookId === book.id) || null;

        if (!foundProduct) {
            return {
                statusCode: 404,
                headers: getCorsHeaders(),
                body: JSON.stringify({ error: BOOK_NOT_FOUND })
            };
        }

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify(foundProduct)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    }
};
