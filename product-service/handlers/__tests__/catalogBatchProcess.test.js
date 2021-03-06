import AWSMock from 'aws-sdk-mock';
import { Client } from 'pg';
import { catalogBatchProcess } from '../catalogBatchProcess.js'

jest.mock('pg', () => {
    const mockClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return {
        Client: jest.fn(() => mockClient)
    };
});

describe("catalog batch process", () => {
    const snsCallback = jest.fn();
    AWSMock.mock('SNS', 'publish', snsCallback);

    let client;

    beforeEach(() => {
        client = new Client();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should insert data to db and send notification', async () => {
        client.query.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 0 });
        const event = {
            Records: [
                {
                    body: JSON.stringify({
                        title: 'A', description: 'A', price: 10, image: 'image.jpg', count: 2
                    })
                },
                {
                    body: JSON.stringify({
                        title: 'B', description: 'B', price: 10, image: 'image.jpg', count: 2
                    })
                },
            ]
        };

        expect.assertions(2);
        await catalogBatchProcess(event);

        expect(client.query).toBeCalledTimes(8);
        expect(snsCallback).toHaveBeenCalled();
    });
});
