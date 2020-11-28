import AWS from 'aws-sdk';
import { MAIN_REGION } from '../constants/s3.js';
import { Client } from 'pg';
import { dbOptions } from '../constants/dbOptions';
import { insertBookQuery, insertStockQuery } from '../db/sqlQueries.js';

export const catalogBatchProcess = async (event) => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const books = event.Records.map(({ body }) => body);

        for(const record of event.Records) {
            const { body } = record;
            const { title, description, price, image, count } = JSON.parse(body);

            await client.query('BEGIN');

            const { rows: book } = await client.query(insertBookQuery, [title, description, price, image]);
            const { id } = book[0];

            await client.query(insertStockQuery, [id, count]);

            await client.query('COMMIT');
        }

        const sns = new AWS.SNS({ region: MAIN_REGION });
        sns.publish({
            Subject: 'These new products were inserted',
            Message: JSON.stringify(books),
            TopicArn: process.env.SNS_ARN
        }, (error) => {
            console.log("SNS publish::error:: ", error);
            console.log("All books", books)
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.log("catalogBatchProcess::error ", error);
    } finally {
        client.end();
    }
};