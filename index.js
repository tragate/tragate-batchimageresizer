const aws = require('aws-sdk');
const config = require('./config.json');
var upload = require('./upload.js');
var download = require('./download.js');

(async function () {
    try {
        listAllObjectsFromS3Bucket('imgcdn.tragate.com');
    } catch (e) {
        console.log('out error', e);
    }
})();

async function listAllObjectsFromS3Bucket(bucket, prefix) {
    const s3 = new aws.S3({
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
        region: 'eu-west-1'
    });

    let isTruncated = true;
    let marker;
    var count = 0;
    while (isTruncated) {
        let params = { Bucket: bucket };
        if (prefix) params.Prefix = prefix;
        if (marker) params.Marker = marker;
        try {
            const response = await s3.listObjects(params).promise();
            response.Contents.forEach(item => {
                if (item.Key.startsWith('items', 0) && item.Key != 'items/') {
                    download.download({ Bucket: 'imgcdn.tragate.com', Key: item.Key }).then(function (response) {
                        upload.upload({
                            Bucket: 'cdn.tragate.com',
                            Key: item.Key,
                            Body: response.Body,
                            ContentType: 'image/' + item.Key.substr(item.Key.length - 3),
                            ACL: 'public-read'
                        }).then(function (data) {
                            console.log(item.Key);
                            console.info('Image uploaded!');
                        }).catch(function (err) {
                            console.log(item.Key);
                            console.error(err);
                        });
                    });
                    count++;
                }
            });
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                marker = response.Contents.slice(-1)[0].Key;
            }
        } catch (error) {
            throw error;
        }
    }

    console.log("Image upload process has been finished and total image = " + count);
}
