var fs    = require('fs');
var https = require('https');
var path  = require('path');

function getJSON(file, callback) {
    fs.readFile(file, function(err, data) {
        if (err) {
            console.log(err);
        }
        callback(JSON.parse(data.toString()));
    });
}

function downloadThumbnails(options, callback) {
    console.log('downloading thumbnails');
    var downloadedThumbnails = 0;
    fs.readdir(path.join(options.path, 'items'), function(err, files) {
        if (err) {
            console.log(err);
        }
        files.forEach(function(file) {
            getJSON(path.join(options.path, 'items', file), function(data) {
                if (data.snippet.hasOwnProperty('thumbnails')) {
                    var file = fs.createWriteStream(path.join(options.path, 'thumbnails', data.contentDetails.videoId + '.jpg'));
                    var request = https.get(data.snippet.thumbnails.maxres.url, function(response) {
                        response.pipe(file).on('finish', function() {
                            downloadedThumbnails++;
                            console.log('Downloaded thumbnail for ' + data.contentDetails.videoId + ' (' + downloadedThumbnails + '/' + files.length + ')');
                            if (downloadedThumbnails == files.length) {
                                callback();
                            }
                        });
                    });
                } else {
                    console.log(data.contentDetails.videoId + '.json has no thumbnail!');
                    downloadedThumbnails++;
                }
            });
        });
    });
}
module.exports = downloadThumbnails;

