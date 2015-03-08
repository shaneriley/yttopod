var fs          = require('fs');
var path        = require('path');
var dl_pages    = require('./dl_pages.js');
var parse_pages = require('./parse_pages.js');
var dl_thumbs   = require('./dl_thumbs.js');
var dl_mp3s     = require('./dl_mp3s.js');
var make_feed   = require('./make_feed.js');

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

function dlyttopod(options, callback) {
    fs.mkdir(options.path, function(){});
    fs.mkdir(path.join(options.path, 'pages'), function(){});
    fs.mkdir(path.join(options.path, 'items'), function(){});
    fs.mkdir(path.join(options.path, 'mp3s'), function(){});
    fs.mkdir(path.join(options.path, 'thumbs'), function(){});
    
    dl_pages(options, function() {
        parse_pages(options, function() {
            dl_thumbs(options, function() {
                dl_mp3s(options, function() {
                    make_feed(options, callback);
                });
            });
        });
    });
}
module.exports = dlyttopod;

