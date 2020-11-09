import { getProductById } from './handlers/getProductById.js';
import { getProductsList } from './handlers/getProductsList.js';
import { postProduct } from './handlers/postProduct.js';
import { invokeDb } from './handlers/pgClientLambda.js';

export {
    getProductById,
    getProductsList,
    postProduct,
    invokeDb,
}