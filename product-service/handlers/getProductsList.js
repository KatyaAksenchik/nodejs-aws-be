import booksList from '../data/booksList.json';
import { SOMETHING_WENT_WRONG } from '../constants/responseMessages.js';
import { getCorsHeaders } from '../helpers/responseHelper.js';

export const getProductsList = async () => {
    try {
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
    }
};
