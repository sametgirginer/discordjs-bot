const fs = require('fs');

module.exports = {
    writeLog: async function(message) {
        if (message) {
            let zaman = new Date(Date.now());
            let gun = addZero(zaman.getDate());
            let ay = addZero(zaman.getUTCMonth() + 1);
            let yil = zaman.getFullYear();
            let chname = message.channel.name;
            let kanaladi = chname.replace('🎫', '');

            if (chname.startsWith('🎫')) {
                let pathFile = `./logs/support/${gun}${ay}${yil}-${kanaladi}-${message.channel.id}.log`;
                let msg  = `MsgID: ${message.id} Usr: ${message.author.id}-${message.author.username} Msg: ${message.content}\n`;

                fs.open(pathFile, 'a', (err) => {
                    if (err) throw err;
                    fs.appendFileSync(pathFile, msg, { encoding: "utf8"});
                });
            }
        }
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}