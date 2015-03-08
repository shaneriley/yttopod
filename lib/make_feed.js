var fs       = require('fs');
var RSS      = require('rss');
var path     = require('path');
var url      = require('url'); //Unused, but here because writing urljoin instead of url.join feels weird
    url.join = require('url-join');

function getJSON(file, callback) {
    fs.readFile(file, function(err, data) {
        if(err) { 
            return console.log(err); 
        }
        callback(JSON.parse(data.toString()));
    });
}

function make_feed(options, callback) {
    var feed = new RSS({
        title:             options.title,
        description:       options.description,
        generator:         options.generator,
        feed_url:          options.feedUrl || url.join(options.url, 'feed.xml'),
        site_url:          options.siteUrl || options.url,
        image_url:         options.imageUrl || url.join(options.url, 'coverart.png'),
        docs:              options.docs,
        managingEditor:    options.managingEditor,
        webMaster:         options.webMaster,
        copyright:         options.copyright,
        language:          options.language,
        categories:        options.categories,
        pubDate:           options.pubDate,
        ttl:               options.ttl,
        hub:               options.hub,
        custom_namespaces: {
            'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
        },
        custom_elements:   [
            {'itunes:author': options.itunesAuthor},
            {'itunes:subtitle': options.itunesSubtitle},
            {'itunes:summary': options.itunesSummary},
            {'itunes:image': {
                _attr: {
                    href: options.itunesImage || options.imageUrl || options.url + '/coverart.jpg'
                }
            }},
        ]
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
                },
                custom_elements: [
                    {'itunes:image': {
                        _attr: { href: url.join(options.url, "thumbs", videoId + '.jpg') }
                        }
                    },
                ]
            });
        }
        var xml = feed.xml(options.indent);
        fs.writeFile(path.join(options.path, 'feed.xml'), xml, function() {
            console.log("Feed made!")
            callback();
        });
    });
}
module.exports = make_feed;

