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
}