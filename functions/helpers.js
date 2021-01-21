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

    youtube_parser: async function(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    },
}