import AWSMock from 'aws-sdk-mock';

import { importProductsFile } from '../importProductsFile.js'
import { getCorsHeaders } from '../../helpers/responseHelper.js';
import { INCORRECT_PASSED_PARAMS } from '../../constants/responseMessages.js';

describe("import Products File", () => {
    const event = {
        queryStringParameters: {
            name: 'A.csv'
        }
    };
    const signedUrl = `https://aws.someting/${event.queryStringParameters.name}+hash`;

    test('should return signed url', async () => {
        AWSMock.mock('S3', 'getSignedUrl', signedUrl);

        expect.assertions(1);

        const result = await importProductsFile(event);

        expect(result).toEqual({
            statusCode: 200,
            headers: getCorsHeaders(),
            body: signedUrl
        });
    });

    test('should return error', async () => {
        expect.assertions(1);

        const result = await importProductsFile({
            queryStringParameters: {}
        });

       expect(result).toEqual({
            statusCode: 400,
            headers: getCorsHeaders(),
            body: JSON.stringify({ error: INCORRECT_PASSED_PARAMS })
        });
    });
});
