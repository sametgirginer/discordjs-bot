const { permCheck } = require('./permission');
const fs = require('fs');
const pathFile = `data/otuzbir.json`;

module.exports = {
    otuzbir: async function(client, message) {
        if (permCheck(message, 'SEND_MESSAGES', client.user.id)) {
            let saatDurum = fs.readFileSync(pathFile);
            saatDurum = JSON.parse(saatDurum);

            let saat = new Date().getHours();
            let dakika = new Date().getUTCMinutes();

            saatDurum.forEach(s => {

                if (s[saat] === false && dakika === 31) { 
                    message.channel.send('saate bakın KŞLSDAGKŞLSDKGŞALSDKGLŞAKSDG');
                    
                    s[saat] = true;
                    fs.open(pathFile, 'as+', (err) => {
                        if (err) throw err;
                        fs.writeFileSync(pathFile, '', function(){ });
                        fs.appendFileSync(pathFile, JSON.stringify(saatDurum, null, 4), { encoding: "utf8"});
                    });
                } else if (dakika != 31) {
                    s[saat] = false;

                    fs.open(pathFile, 'as+', (err) => {
                        if (err) throw err;
                        fs.writeFileSync(pathFile, '', function(){ });
                        fs.appendFileSync(pathFile, JSON.stringify(saatDurum, null, 4), { encoding: "utf8"});
                    });
                }
            });
        }
    }
}

