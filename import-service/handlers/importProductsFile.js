import AWS from 'aws-sdk';
import { BUCKET_NAME, BUCKET_REGION, SIGNATURE_VERSION } from '../constants/s3.js';
import { SOMETHING_WENT_WRONG, INCORRECT_PASSED_PARAMS } from '../constants/responseMessages.js';
import { getCorsHeaders } from '../helpers/responseHelper.js';

export const importProductsFile = async (event) => {
    const { name } = event.queryStringParameters;

    try {
        if(!name) {
            return {
                statusCode: 400,
                headers: getCorsHeaders(),
                body: JSON.stringify({ error: INCORRECT_PASSED_PARAMS })
            };
        }

        const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: SIGNATURE_VERSION });

        const signedUrlParams = {
            Bucket: BUCKET_NAME,
            Key: `uploaded/${name}`,
            Expires: 60,
            ContentType: 'text/csv'
        };
        const signedUrl = await s3.getSignedUrlPromise('putObject', signedUrlParams);

        return {
            statusCode: 202,
            headers: getCorsHeaders(),
            body: signedUrl
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    }
};