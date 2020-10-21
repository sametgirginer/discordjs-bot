const fs = require('fs');
const pathFile = `data/otuzbir.json`;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    otuzbir: async function(message) {
        let saatDurum = fs.readFileSync(pathFile);
        saatDurum = JSON.parse(saatDurum);

        let saat = new Date().getHours();
        let dakika = new Date().getUTCMinutes();

        saatDurum.forEach(s => {

            if (s[saat] === false && dakika === 31) { 
                message.channel.send('saate bakın KŞLSDAGKŞLSDKGŞALSDKGLŞAKSDG');
                
                s[saat] = true;
                fs.open(pathFile, 'a', (err) => {
                    if (err) throw err;
                    fs.writeFileSync(pathFile, '', function(){ });
                    sleep(10).then(() => {
                        fs.appendFileSync(pathFile, JSON.stringify(saatDurum, null, 4), { encoding: "utf8"});
                    });
                });
            } else if (dakika != 31) {
                s[saat] = false;

                fs.open(pathFile, 'a', (err) => {
                    if (err) throw err;
                    fs.writeFileSync(pathFile, '', function(){ });
                    sleep(10).then(() => {
                        fs.appendFileSync(pathFile, JSON.stringify(saatDurum, null, 4), { encoding: "utf8"});
                    });
                });
            }
        });
    }
}

