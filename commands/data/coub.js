const { MessageEmbed, MessageAttachment } = require('discord.js');
const cmd = require('node-cmd');
const fs = require('fs');
const FFmkek = require('ffmkek');
const Coub = require('coub-dl');
const { infoMsg } = require('../../functions/message.js');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    name: 'coub',
    category: 'data',
    description: 'coub.com sitesinden video çeker.',
	prefix: true,
    owner: true,
    onlykeyubu: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, coub bağlantısı girmelisiniz.`, true, 10000);    

        if (!String(args[0]).match(/(https?:\/\/(coub.com\/view\/[a-zA-Z0-9]{6}))+/g)) 
            return infoMsg(message, 'FFE26A', `<@${message.author.id}>, sadece doğru girilen coub bağlantısına izin verilmektedir.`, true, 10000);

        message.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });

        var cooldownEmbed = new MessageEmbed()
            .setColor('#d747ed')
            .setDescription(`<@${message.author.id}>, **coub videosu** hazırlanıyor. **5 saniye** sonra yüklenecek.`)
        
        message.channel.send(cooldownEmbed).then(async msg => {
            let rn = Math.ceil(Math.random() * 5000);
            const file = 'data/coub/output-'+ rn +'.mp4';
            cmd.run('coub-dl -i '+ args[0] +' -o '+ file +' --loop 10 --time 10 --scale 600 -c');
            
            sleep(5000).then(() => {
                fs.exists(file, function(err) {
                    if (err) {
                        let stats = fs.statSync(file);
                        let fileSizeInBytes = stats['size'];
                        if (fileSizeInBytes === 0) { return infoMsg(msg, 'B20000', `<@${message.author.id}>, coub videosunun tamamı indirilemediği için işlemede hata oluştu.`, true, 10000); }

                        msg.delete({ timeout: 500, reason: 'Otomatik bot işlemi.' });
                        const coubVideo = new MessageAttachment(file, 'keyubu-coub-'+ rn +'.mp4');

                        infoMsg(message, 'd747ed', `<@${message.author.id}>, coub videosu yüklendi.`, false, 0);
                        return message.channel.send(coubVideo);
                    } else {
                        msg.delete({ timeout: 500, reason: 'Otomatik bot işlemi.' });
                        return infoMsg(msg, 'B20000', `<@${message.author.id}>, coub videosu indirilirken bir hata oluştu.`, true, 10000);
                    }
                });
            });
        });
    }
}