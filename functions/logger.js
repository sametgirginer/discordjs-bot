const fs = require('fs');

module.exports = {
    writeLog: async function(message) {
        if (message) {
            let zaman = new Date(Date.now());
            let gun = addZero(zaman.getDate());
            let ay = addZero(zaman.getUTCMonth() + 1);
            let yil = zaman.getFullYear();

            if (message.channel.name.startsWith('🎫')) {
                let pathFile = `./logs/${ay}.${gun}.${yil}-${message.channel.id}-${message.guild.id}.log`;
                let msg  = `MsgID: ${message.id} Usr: ${message.author.id}-${message.author.username} Msg: ${message.content}\n`;

                fs.open(pathFile, 'a', (err) => {
                    if (err) throw err;
                    fs.appendFileSync(pathFile, msg, { encoding: "utf8"});
                });
            }
        }
    },

    errorLog: async function(message, error) {
        if (message) {
            let d = new Date(Date.now());
            let date = `${addZero(d.getDate())}.${addZero(d.getUTCMonth() + 1)}.${d.getFullYear()}`;
            date += ` - ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;

            let pathFile = `./logs/errors/${message.guild.id}.log`;
            let lineerror = `Date: ${date}\nMessage: ${message.id}\nUser: ${message.author.id}\nContent: ${message.content}\nError: ${error.name} - ${error.message}\n---------------------------------------------\n`;

            fs.open(pathFile, 'a', (err) => {
                if (err) throw err;
                fs.appendFileSync(pathFile, lineerror, { encoding: "utf8"});
            });
        }
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}