const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey,
})

const uploadNotes = (filename, bucketname, file) => {

    return new Promise((resolve, reject) => {
        const params = {
            Key: filename,
            Bucket: bucketname,
            Body: file,
            ContentType: 'audio/mpeg',
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data.Location)
            }
        })
    })
}

module.exports = uploadNotes;
