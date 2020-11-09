import { Client } from 'pg';
import { dbOptions } from '../constants/dbOptions.js';
import { logIncomeRequestEvent } from '../helpers/logRequestHelper.js';

const createBooksTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        price INTEGER,
        image TEXT
     )
`;

const createStocksTableQuery = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    CREATE TABLE IF NOT EXISTS stocks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        book_id UUID,
        count INTEGER,
        foreign key ("book_id") references "books" ("id")
    )
`;

const insertBooksQuery = `
    INSERT INTO books (title, description, price, image) VALUES
        ('The Lord of the Rings, by J.R.R. Tolkien','Middle Earth is a wonderful, expansive fantasy world filled with turmoil, heroes, evil and innocence.', 2.4, 'https://cdn.lifehack.org/wp-content/uploads/2015/03/9780618640157_custom-s6-c30.jpg'),
        ('The Grapes of Wrath, by John Steinbeck','Published in 1939, this novel set during The Great Depression follows one Oklahoma family as they are forced to travel to California.', 10, 'https://cdn.lifehack.org/wp-content/uploads/2015/03/9780141185064.jpg'),
        ('The Kite Runner, by Khaled Hosseini','A story of true friendship, The Kite Runner follows Amir as he tries to find the only true friend he’s ever had.', 23, 'https://cdn.lifehack.org/wp-content/uploads/2015/03/kiterunner.jpg')
`;

const insertStocksQuery = `
    INSERT INTO stocks (book_id, count) VALUES
        ('5346f244-98c8-48ef-b7d6-c0363075f590', 10),
        ('707afe54-16a7-4104-ae05-632360cdc4ea', 5),
        ('4ecabb9a-289e-497b-92b5-b8cc0de4d8f4', 8)
`;

export const invokeDb = async event => {
    logIncomeRequestEvent('invokeDb', event);

    const client = new Client(dbOptions);
    await client.connect();

    try {
        const ddlBooksResult = await client.query(createBooksTableQuery);
        console.log("ddlBooksResult", ddlBooksResult);

        const ddlStocksResult = await client.query(createStocksTableQuery);
        console.log("ddlStocksResult", ddlBooksResult);

        const dmlBooksResult = await client.query(insertBooksQuery);
        console.log("dmlBooksResult", ddlBooksResult);

        const dmlStocksResult = await client.query(insertStocksQuery);
        console.log("dmlBooksResult", dmlStocksResult);

        const { rows: stocks } = await client.query(`SELECT * FROM stocks`);
        console.log("stocks", stocks);
    } catch (err) {
        console.error('Error during database request executing::', err);
    } finally {
        client.end();
    }
};