var fs   = require('fs');
var ytdl = require('ytdl-core');
var path = require('path');

// Constants
var OPTIONS = {
    filter: 'audioonly'
};

// Helper method
function getJSON(file, callback) {
    fs.readFile(file, function(err, data) {
        if (err) {
            return console.log(err);
        }
        callback(JSON.parse(data.toString()));
    });
}

function dl_mp3s(options, callback) {
    console.log("Downloading mp3s");
    var finished = 0;
    fs.readdir('./' + path.join(options.path, 'items'), function(err, files) {
        if (err) {
            return console.log(err);
        }
        files.forEach(function(file) {
            getJSON('./' + path.join(options.path, 'items', file), function(data) {
                var videoId = data.contentDetails.videoId;
                var url = "https://www.youtube.com/watch?v=" + videoId;
                var file = fs.createWriteStream('./' + path.join(options.path, 'mp3s', videoId + '.mp3'));
                console.log("Downloading " + videoId);
                
                ytdl(url, OPTIONS).pipe(file);
                file.on('finish', function() {
                    finished++;
                    console.log("Finished downloading " + videoId + " (" + finished + "/" + String(files.length) + ")");
                    if (finished === files.length) {
                        callback();
                    }
                });
            });
        });
    });
}
module.exports = dl_mp3s;

