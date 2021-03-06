import { generatePolicy } from '../helpers/policyHelper.js'

const TOKEN_EVENT_TYPE = 'TOKEN';

export const basicAuthorizer = async (event, context, callback) => {
    console.log('Event', JSON.stringify(event));

    if (event.type !== TOKEN_EVENT_TYPE) {
        callback('Unauthorized')
    }

    try {
        const authorizationToken = event.authorizationToken;

        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const [ username, password ] = plainCreds;

        console.log(`username ${username} and password ${password}`);

        const storedUserPassword = process.env[username];

        const effect = !storedUserPassword || storedUserPassword !== password
            ? 'Deny'
            : 'Allow';

        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        callback(null, policy);

    } catch (error) {
        console.log("error", error);
        callback(`Unauthorized: ${ error.message }`)
    }
};
