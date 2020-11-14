import AWS from 'aws-sdk';
import csv from 'csv-parser';

import {
    BUCKET_NAME,
    BUCKET_REGION,
    SIGNATURE_VERSION,
    UPLOADED_FOLDER_NAME,
    PARSED_FOLDER_NAME,
} from '../constants/s3.js';

export const importFileParser = (event) => {
    try {
        const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: SIGNATURE_VERSION });

        for(const record of event.Records) {
            const recordKey = record.s3.object.key;
            const s3Stream = s3.getObject({ Bucket: BUCKET_NAME, Key: recordKey }).createReadStream();
            const result = [];

            s3Stream
                .pipe(csv())
                .on('data', (data) => {
                    console.log("data", data);
                    result.push(data);
                })
                .on('end', async () => {
                    console.log("result", result);

                    const copyObjectParams = {
                        Bucket: BUCKET_NAME,
                        CopySource: `${BUCKET_NAME}/${recordKey}`,
                        Key: recordKey.replace(UPLOADED_FOLDER_NAME, PARSED_FOLDER_NAME)
                    };

                    const deleteObjectParams = {
                        Bucket: BUCKET_NAME,
                        Key: recordKey,
                    };

                    await s3.copyObject(copyObjectParams).promise();
                    await s3.deleteObject(deleteObjectParams).promise();
                });
        }
    } catch (error) {
        console.log("importFileParser::error:: ", error);
    }
};

