export const logIncomeRequestEvent = (request, event) => {
    const { path, queryStringParameters, pathParameters } = event;

    console.log(`request ${request} event: 
        path: ${path}
        query parameters: ${JSON.stringify(queryStringParameters)}
        path Parameters: ${JSON.stringify(pathParameters)}
    `)
};