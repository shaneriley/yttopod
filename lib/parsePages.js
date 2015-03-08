var fs   = require('fs');
var path = require('path');

// Helper method
function getJSON(file, callback) {
    var data = fs.readFileSync(file);
    callback(JSON.parse(data.toString()));
}

function parsePages(options, callback) {
    if(!options.actions.parsePages) { 
        return callback(); 
    }
    console.log('Extracting items from pages');
    var pagesPath = path.join(options.path, 'pages');
    fs.readdir(pagesPath, function(err, files) {
        if (err) {
            console.log(err);
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            getJSON(path.join(pagesPath, file), function(data) {
                for (var j = 0; j < data.items.length; j++) {
                    var item = data.items[j];
                    var title = item.snippet.title;
                    if (options.ytTitleRegex.test(title)) {
                        fs.writeFileSync(path.join(options.path, 'items', item.contentDetails.videoId + '.json'), JSON.stringify(item));
                    }
                }
            });
            console.log('Parsed page ' + i);
        }
        callback();
    });
}
module.exports = parsePages;

