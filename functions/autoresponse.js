const fs = require('fs');
const { infoMsg } = require('./message')
var cevaplar = fs.readFileSync('data/oto-cevap.json');
cevaplar = JSON.parse(cevaplar);

module.exports = {
    autoResponse: async function(message) {
        //if (message.guild.id != process.env.supportserver) return;
        let icerik = message.content.toLowerCase();

        cevaplar.forEach(c => {
            if (Array.isArray(c.mesaj)) {
                c.mesaj.forEach(m => {
                    cevap = c.cevap.replace('@user', `@${message.author.id}`);
                    if (c.ara === true) { 
                        if (icerik.search(m) >= 0) return message.channel.send(cevap);
                    } else if (m === icerik) return message.channel.send(cevap);
                });
            } else {
                cevap = c.cevap.replace('@user', `@${message.author.id}`);
                if (c.ara === true) {
                    if (icerik.search(c.mesaj) >= 0) return message.channel.send(cevap);
                } else if (c.mesaj === icerik) return message.channel.send(cevap);
            }
        });
    }
}