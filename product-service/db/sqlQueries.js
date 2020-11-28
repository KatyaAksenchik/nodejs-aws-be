export const insertBookQuery = `
    INSERT INTO books (title, description, price, image) VALUES ($1, $2, $3, $4) RETURNING id
`;

export const insertStockQuery = `
    INSERT INTO stocks (book_id, count) VALUES ($1, $2)
`;
