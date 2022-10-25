const stream = require('stream')
const streamify = require('stream-array')
const concat = require('concat-stream')
const archiver = require('archiver')


const zipS3Files = {}
module.exports = zipS3Files

zipS3Files.exportZip = (fileKeys, s3, bucket) => {
    return new Promise((resolve, reject) => {
        try {
            if (!(fileKeys && Array.isArray(fileKeys) && fileKeys.length !== 0)) reject('fileKeys not valid. It should be an array')

            const keyStream = streamify(fileKeys)

            var fileStream = new stream();
            fileStream.readable = true;

            var fileCounter = 0;

            keyStream.on('data', (file) => {
                fileCounter += 1
                if (fileCounter > 5) {
                    keyStream.pause() // we add some 'throttling' there
                }

                var params = { Bucket: bucket, Key: file }
                var s3File = s3.getObject(params).createReadStream()

                s3File.pipe(
                    concat(function buffersEmit(buffer) {
                        var path = file.replace(/^.*[\\/]/, '')
                        fileStream.emit('data', { data: buffer, path: path })
                    })
                )
                s3File.on('end', function () {
                    fileCounter -= 1
                    if (keyStream.isPaused()) {
                        keyStream.resume()
                    }
                    if (fileCounter < 1) {
                        fileStream.emit('end')
                    }
                })

                s3File.on('error', function (err) {
                    err.file = file
                    fileStream.emit('error', err)
                })
            })

            const archive = archiver('zip')

            archive.on('error', (error) => {
                reject(error)
            })

            fileStream.on('data', (file) => {
                if (file.path[file.path.length - 1] === '/') {
                    // self.debug && console.log('don\'t append to zip', file.path)
                    return
                }
                let fname = file.path;

                const entryData = typeof fname === 'object' ? fname : { name: fname }
                if (file.data.length === 0) {
                    archive.append('', entryData)
                } else {
                    archive.append(file.data, entryData)
                }
            })
                .on('end', () => {
                    archive.finalize()
                })
                .on('error', (err) => {
                    archive.emit('error', err)
                })

            resolve(archive);

        } catch (error) {
            reject(error)
        }
    })
}