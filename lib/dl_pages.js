var https        = require('https');
var querystring  = require('querystring');
var concatStream = require('concat-stream');
var fs           = require('fs');
var path         = require('path');

// Constants
var API_CHANNELS_URL = 'https://www.googleapis.com/youtube/v3/channels';
var API_PLAYLIST_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';

// Helper methods
function getApiUri(api_url, query) {
    return api_url + "?" + querystring.stringify(query);
}

function getData(url, callback) {
    https.get(url, function(response) {
        response.pipe(concatStream(function(data) {
            callback(data.toString());
        }));
    });
}
function getJSON(url, callback) {
    getData(url, function(data) {
        callback(JSON.parse(data));
    });
}

function getChannelUploads(options, callback) {
    var query = {
        part: 'contentDetails',
        forUsername: options.ytUsername,
        fields: 'items/contentDetails/relatedPlaylists/uploads',
        key: options.ytApiKey
    };
    getJSON(getApiUri(API_CHANNELS_URL, query), function(data) {
        if (data.hasOwnProperty('error')) {
            console.log(data.error);
        }
        callback(data.items[0].contentDetails.relatedPlaylists.uploads);
    });
}

function downloadPage(options, fileName, playlistId, pageToken, callback) {
    var query = {
        part: 'snippet, contentDetails',
        maxResults: 50,
        fields: 'nextPageToken, pageInfo/totalResults, items(snippet(publishedAt, title, description, thumbnails/maxres), contentDetails/videoId)',
        playlistId: playlistId,
        key: options.ytApiKey
    };
    if (pageToken) {
        query.pageToken = pageToken;
    }
    getData(getApiUri(API_PLAYLIST_URL, query), function(page) {
        fs.writeFile(path.join(options.path, 'pages/') + fileName, page, function(err) {
            if (err) {
                console.log(err);
            }
        });
        page = JSON.parse(page);
        if (page.hasOwnProperty('error')) {
            console.log(page.error);
        }
        callback(page.nextPageToken);
    });
}
function downloadNextPage(options, pageNr, playListId, callback, pageToken) {
    downloadPage(options, pageNr + '.json', playListId, pageToken, function(nextPageToken) {
        console.log("Downloaded page " + pageNr + " (pageToken: " + pageToken + ")");
        if (nextPageToken) {
            downloadNextPage(options, pageNr + 1, playListId, callback, nextPageToken);
        } else {
            callback();
        }
    });
}

function downloadPages(options, callback) {
    console.log("Getting " + options.ytUsername + "\'s upload playlist");
    getChannelUploads(options, function(playlistId) {
        console.log("Got playlistId: " + playlistId);
        downloadNextPage(options, 1, playlistId, callback);
    });
}
module.exports = downloadPages;

