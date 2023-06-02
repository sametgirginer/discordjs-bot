const request = require('request');
const fs = require('fs');

module.exports = {
    usrNameRegex: async function(str) {
        return new Promise((resolve) => {
            if(str) {
                let name = str.replace(/[^A-Za-z0-9]+/g, "");
                resolve(JSON.parse(JSON.stringify(name)));
            }

            resolve(false);
        });
    },

    youtube_parser: async function(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    },

    sleep: async function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    twitterRegex: async function(str, index) {
        var regex = /(^|[^'"])(https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+))/;
        if (!regex.test(str)) {
            return false;
        } else {
            let matched = str.match(regex);
            return matched[index];
        }
    },

    checkUsrName: async function(username, limit) {
        let punctuationRegEx = /[﷽]/g;

        if (punctuationRegEx.test(username)) {
            return "🔥";
        } else if (username.length > limit) {
            return username.slice(0, limit);
        } else {
            return username;
        }
    },

    stringShort: async function(str, limit) {
        if (str.length > limit) return (str.substr(0, limit) + "...");
        return str;
    },

    msToMinutesAndSeconds(ms) {
        var minutes = Math.floor(ms / 60000);
        var seconds = ((ms % 60000) / 1000).toFixed(0);
        return (
            seconds == 60 ?
            (minutes+1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        );
    },

    fileSize: async function(data, limit = false) {
        let stats = fs.statSync(data);
        stats.size = Math.round(stats.size / (1024*1024));

        if (limit) {
            if (stats.size > limit) {
                return true;
            } else {
                return false;
            }
        } else {
            return stats.size;
        }
    },

    tiktokMetaVideo: async function(url, onlyVideo = false) {
        var regex = /https?:\/\/(?:m|www|vm)\.tiktok\.com\/.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+)\b/;
        if (regex.test(url)) url = "https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=" + url.match(regex)[1];

        return new Promise((resolve) => {
            try {
                request({
                    uri: url,
                    headers: {
                        "Referer": "https://www.tiktok.com/",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
                    }
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        body = JSON.parse(body);
                        if (onlyVideo) resolve(body.aweme_list[0].video.play_addr.url_list[0]);
                        resolve(body);
                    } else {
                        resolve(false);
                    }
                });
            } catch (error) {
                resolve(false);
            }
        });
      },

      getRedirectURL: async function(url) {
        return new Promise(async (resolve, reject) => {
            try {
                request({
                    uri: url,
                }, async function(err, response, body) {
                    if (!err && response.statusCode === 200) resolve(response.request.uri.href);
                });
            } catch (error) {
                reject(false);
            }
        });
    },
}