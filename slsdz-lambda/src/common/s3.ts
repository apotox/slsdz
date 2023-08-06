import S3 from "aws-sdk/clients/s3";
import { generateRandomString } from "./helpers";

const expiresInSeconds = 10;

let _s3 = null;
export function getS3Client(): S3 {
    if (!_s3) {
        _s3 = new S3();
    }

    return _s3;
}

interface signedData {
    url: string;
    id: string;
}
export async function getSignedUrl({
    _id,
    bucket,
}: {
    _id?: string;
    bucket: string;
}): Promise<signedData> {
    const id = _id || generateRandomString();

    const params = {
        Bucket: bucket,
        Key: `${id}.zip`,
        Expires: expiresInSeconds,
        ContentType: "application/zip",
        ACL: "private",
    };

    const url = getS3Client().getSignedUrl("putObject", params);

    return {
        url,
        id,
    };
}
