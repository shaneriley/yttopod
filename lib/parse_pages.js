var fs   = require('fs');
var path = require('path');

// Helper method
function getJSON(file, callback) {
    var data = fs.readFileSync(file);
    callback(JSON.parse(data.toString()));
}

function parse_pages(options, callback) {
    console.log("Extracting items from pages");
    var pages_path = path.join(options.path, 'pages/');
    var items_path = path.join(options.path, 'items/');
    fs.readdir(pages_path, function(err, files) {
        if (err) {
            console.log(err);
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            getJSON(pages_path + file, function(data) {
                for (var j = 0; j < data.items.length; j++) {
                    var item = data.items[j];
                    var title = item.snippet.title;
                    if (options.ytTitleRegex.test(title)) {
                        fs.writeFileSync(items_path + item.contentDetails.videoId + '.json', JSON.stringify(item));
                    }
                }
            });
            console.log("Parsed page " + i);
        }
        callback();
    });
}
module.exports = parse_pages;

