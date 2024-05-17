const http = require('http');
const https = require('https');
const fs = require('fs');

module.exports = {
    download: async function(url, dest, cookies) {
        var file = fs.createWriteStream(dest);
        var headerCookie = "";
        var options = {};

        if (cookies) {
            cookies.forEach(cookie => {
                headerCookie += cookie + ";";
            });

            options = {
                headers: { "Cookie" : headerCookie },
            };
        }

        return new Promise((resolve, reject) => {
            var responseSent = false;
            https.get(url, options, response => {
                response.pipe(file);
                file.on('finish', () =>{
                    file.close(() => {
                        if(responseSent) return;
                        responseSent = true;
                        resolve();
                    });
                });
            }).on('error', err => {
                if(responseSent) return;
                responseSent = true;
                reject(err);
            });
        });
    }
}