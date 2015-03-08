var fs       = require('fs');
var Podcast  = require('podcast');
var path     = require('path');
var url      = require('url'); //Unused, but here because writing urljoin instead of url.join feels weird
var url.join = require('url-join');

function getJSON(file, callback) {
    fs.readFile(file, function(err, data) {
        if(err) { 
            return console.log(err); 
        }
        callback(JSON.parse(data.toString()));
    });
}

function make_feed(options) {
    var feed = new Podcast({
        title:          options.title,
        description:    options.description,
        generator:      options.generator,
        feed_url:       url.join(options.url, 'feed.xml'),
        site_url:       options.url,
        image_url:      url.join(options.url, 'cover.png'),
        docs:           options.docs,
        author:         options.author,
        managingEditor: options.managingEditor,
        webMaster:      options.webMaster,
        copyright:      options.copyright,
        language:       options.language,
        categories:     options.categories,
        pubDate:        options.pubDate,
        ttl:            options.ttl,
        itunesAuthor:   options.itunesAuthor,
        itunesSubtitle: options.itunesSubtitle,
        itunesSummary:  options.itunesSummary,
        itunesOwner:    options.itunesOwner,
        itunesExplicit: options.itunesExplicit,
        itunesCategory: options.itunesCategory,
        itunesImage:    options.itunesImage
    });

    fs.readdir(path.join(options.path, 'items'), function(err, files) {
        if(err) { 
            return console.log(err); 
        }
        for(var i = 0; i < files.length; i++) {
            var data = JSON.parse(fs.readFileSync(path.join(options.path, 'items', files[i])).toString());
            var videoId = data.contentDetails.videoId;
            feed.item({
                title:       data.snippet.title,
                description: data.snippet.description,
                url:         url.join(options.url, 'mp3s', videoId + '.mp3'),
                guid:        videoId,
                date:        data.snippet.publishedAt,
                enclosure:   {
                    url:  url.join(options.url, 'mp3s', videoId + '.mp3'),
                    file: path.join(options.path, 'mp3s', videoId + '.mp3')
                }
            });
        }
        var xml = feed.xml('  ');
        fs.writeFile(path.join(options.path, 'feed.xml'), xml, function() {
            console.log("feed made!")
        });
    });
}
module.exports = make_feed;

