const aws = require("aws-sdk");
const crypto = require("crypto");
const { promisify } = require("util");
require('dotenv').config(); 
const randomBytes = promisify(crypto.randomBytes);

const region = "ap-south-1";
const bucketName = "photo-upload-face-recognition";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
    ACL: 'public-read',
    ContentType: 'image/jpeg'
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}

module.exports = {
  generateUploadURL,
};
