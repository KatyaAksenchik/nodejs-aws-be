import AWS from 'aws-sdk';
import { BUCKET_NAME, BUCKET_REGION, SIGNATURE_VERSION } from '../constants/s3.js';
import { SOMETHING_WENT_WRONG } from '../constants/responseMessages.js';
import { getCorsHeaders } from '../helpers/responseHelper.js';

export const importProductsFile = async (event) => {
    const { name } = event.queryStringParameters;

    try {
        const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: SIGNATURE_VERSION });

        const signedUrlParams = {
            Bucket: BUCKET_NAME,
            Key: `uploaded/${name}`,
        };
        const signedUrl = s3.getSignedUrl('getObject', signedUrlParams);
        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify(signedUrl)
        };
    } catch (error) {
        console.log("error", error);
        return {
            statusCode: 500,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: SOMETHING_WENT_WRONG })
        };
    }
};