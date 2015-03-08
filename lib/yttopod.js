var fs                 = require('fs');
var path               = require('path');
var downloadPages      = require('./downloadPages.js');
var parsePages         = require('./parsePages.js');
var downloadThumbnails = require('./downloadThumbnails.js');
var downloadMp3s       = require('./downloadMp3s.js');
var makeFeed           = require('./makeFeed.js');

var API_CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';
var API_PLAYLIST_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

/**
 * @param {json} options The global options passed between all yttopod functions
 *   @param {String} ytApiKey API-Key for the YouTube Data API v3
 *   @param {String} ytUsername Youtube username whose uploads are being turned into podcast format
 *   @param {Regex} ytTitleRegex Regex to filter the users uploads by
 *   @param {String} path Path to put the podcast and its files in
 *   @param {json} actions Which of the following actions to perform (in sequence):
 *     @param {Boolean} downloadPages 
 *     @param {Boolean} downloadThumbnails
 *     @param {Boolean} downloaddMp3s
 *     @param {Boolean} makeFeed
 *   TODO: Document feed options
 * @see {@link https://github.com/dylang/node-rss|node-rss}
 */ 

function yttopod(options, callback) {
    fs.mkdir(options.path, function(){});
    fs.mkdir(path.join(options.path, 'pages'), function(){});
    fs.mkdir(path.join(options.path, 'items'), function(){});
    fs.mkdir(path.join(options.path, 'mp3s'), function(){});
    fs.mkdir(path.join(options.path, 'thumbnails'), function(){});
    
    downloadPages(options, function() {
        parsePages(options, function() {
            downloadThumbnails(options, function() {
                downloadMp3s(options, function() {
                    makeFeed(options, callback);
                });
            });
        });
    });
}
module.exports = yttopod;

