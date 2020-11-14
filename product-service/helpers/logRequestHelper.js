export const logIncomeRequestEvent = (request, event) => {
    const { path, queryStringParameters, pathParameters, body } = event;

    console.log(`request ${request} event: 
        path: ${path}
        query parameters: ${JSON.stringify(queryStringParameters)}
        path Parameters: ${JSON.stringify(pathParameters)}
        body: ${JSON.stringify(body)}
    `)
};