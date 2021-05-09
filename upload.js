/*jslint node: true */
"use strict";

const aws = require('aws-sdk');
var Promise = require('es6-promise').Promise;
const s3 = new aws.S3({
    accessKeyId: 'AKIAJ4VC5YIBNQHZSKFA',
    secretAccessKey: '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',
    region: 'eu-west-1'
});

var s3Wrapper = (function () {
    return {
        download: function (params) {
            return new Promise(function (resolve, reject) {
                s3.getObject(params, function (err, response) {
                    if (err) {
                        reject('S3.getObject error: ' + err);
                    } else {
                        resolve(response);
                    }
                });
            });
        },
        upload: function (params) {
            return new Promise(function (resolve, reject) {
                s3.putObject(params, function (err, data) {
                    if (err) {
                        reject('S3.putObject error: ' + err);
                    } else {
                        resolve(data);
                    }
                });
            });
        }
    };
})();

module.exports = s3Wrapper;
