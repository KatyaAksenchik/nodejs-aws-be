import booksList from '../data/booksList.json';
import { SOMETHING_WENT_WRONG } from '../constants/responseMessages.js';

export const getProductsList = async () => {
    try {
        return {
            statusCode: 200,
            body: JSON.stringify(booksList)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    }
};
