import AWSMock from 'aws-sdk-mock';

import { importProductsFile } from '../importProductsFile.js'
import { getCorsHeaders } from '../../helpers/responseHelper';

describe("import Products File", () => {
    const event = {
        queryStringParameters: {
            name: 'A.csv'
        }
    };
    const signedUrl = `https://aws.someting/${event.queryStringParameters.name}+hash`;

    beforeAll(() => {
        AWSMock.mock('S3', 'getSignedUrl', (method, _, callback) => {
            callback(null, {
                data: signedUrl,
            });
        });
    });

    test('should return signed url', async () => {
        expect.assertions(1);
        const result = await importProductsFile(event);

        expect(result).toBe({
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify(signedUrl)
        })
    });
});