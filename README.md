# zip-s3-files



[![npm version][npm-badge]][npm-url]

Download selected files from an Amazon S3 bucket as a zip file.



## Install

```
npm install zip-s3-files
```


## Preparation

You should import exportZip function from zip-s3-files
Then configure your aws object (With the credentials if your S3 bucket is not public). Refer to the [AWS SDK][aws-sdk-url] for more details.
Then prepare the list of files to be downloaded as an array

```javascript
const { exportZip } = require('zip-s3-files')
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: WS_S3_SECRET_ACCESS_KEY,
    region: AWS_REGION
})

const bucket = AWS_S3_BUCKET;
const s3 = new aws.S3();

const fileKeys = [
    // Add your file keys here as an array. Example as follows.
    'test/file1.jpg',
    'folder1/subfolder1/testpdf.pdf'
]
```

## Examples
You can use exportZip function with prepared parameters to generate the archive.

### Basic Example 
```javascript
const { exportZip } = require('zip-s3-files')
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: WS_S3_SECRET_ACCESS_KEY,
    region: AWS_REGION
})

const bucket = AWS_S3_BUCKET;
const s3 = new aws.S3();

const fileKeys = [
    // Add your file keys here as an array. Example as follows.
    'test/file1.jpg',
    'folder1/subfolder1/testpdf.pdf'
]

exportZip(fileKeys, s3, bucket)
.then(archive => {
    // Handle archive here
})
.catch(error =>{
    // Handle errors here
})

```

### Example with Async Await
```javascript
const { exportZip } = require('zip-s3-files')
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: WS_S3_SECRET_ACCESS_KEY,
    region: AWS_REGION
})

const bucket = AWS_S3_BUCKET;
const s3 = new aws.S3();

const fileKeys = [
    // Add your file keys here as an array. Example as follows.
    'test/file1.jpg',
    'folder1/subfolder1/testpdf.pdf'
]

const archive = await exportZip(fileKeys, s3, bucket)
// Then can handle the archive.
```

### Example for ExpressJS API
```javascript
const express = require('express')
const { exportZip } = require('zip-s3-files')
const aws = require('aws-sdk')
const app = express()
const port = 3000

aws.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: WS_S3_SECRET_ACCESS_KEY,
    region: AWS_REGION
})

const bucket = AWS_S3_BUCKET;
const s3 = new aws.S3();

const fileKeys = [
    // Add your file keys here as an array. Example as follows.
    'test/file1.jpg',
    'folder1/subfolder1/testpdf.pdf'
]

app.get('/', (req, res) => {
  exportZip(fileKeys, s3, bucket)
    .then(archive => {
        archive.pipe(res)
    })
    .catch(error =>{
        // Handle error
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```
### Example - Write to file system
```javascript
const { exportZip } = require('zip-s3-files')
const fs = require('fs')
const join = require('path').join
const aws = require('aws-sdk')

aws.config.update({
    accessKeyId: AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: WS_S3_SECRET_ACCESS_KEY,
    region: AWS_REGION
})

const bucket = AWS_S3_BUCKET;
const s3 = new aws.S3();

const fileKeys = [
    // Add your file keys here as an array. Example as follows.
    'test/file1.jpg',
    'folder1/subfolder1/testpdf.pdf'
]

const output = fs.createWriteStream(join(__dirname, 'export.zip'))

exportZip(fileKeys, s3, bucket)
    .then(archive => {
        archive.pipe(output)
    })
    .catch(error =>{
        // Handle error
    })
  
```

[aws-sdk-url]: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html
[npm-badge]: https://badge.fury.io/js/zip-s3-files.svg
[npm-url]: https://badge.fury.io/js/zip-s3-files