const http = require('http');
const https = require('https');
const fs = require('fs');

module.exports = {
    download: async function(url, dest) {
        var file = fs.createWriteStream(dest);
    
        return new Promise((resolve, reject) => {
            var responseSent = false; 
            https.get(url, response => {
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