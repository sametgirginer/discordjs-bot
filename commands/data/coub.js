const { MessageEmbed, MessageAttachment } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');
const Coub = require('coub-dl');
const fs = require('fs');

module.exports = {
    name: 'coub',
    category: 'data',
    description: 'coub.com sitesinden video çeker.',
	prefix: true,
    owner: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, coub video bağlantısı girmelisiniz.`, true, 10000);    
        message.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });

        var cooldownEmbed = new MessageEmbed()
            .setColor('#d747ed')
            .setDescription(`<@${message.author.id}>, **coub videosu** hazırlanıyor. Hazır olduğunda yüklenecek.`)
     
        message.channel.send(cooldownEmbed).then(async msg => {
            try {
                if (!fs.existsSync(`data/coub`)) fs.mkdirSync('data/coub');

                const file = `data/coub/output-${Math.ceil(Math.random() * 5000)}.mp4`;
                const coub = await Coub.fetch(args[0], "HIGH");
    
                if (coub.metadata.not_safe_for_work === true) 
                    if (message.channel.nsfw === false || message.channel.nsfw === undefined) {
                        msg.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
                        return infoMsg(message, 'FFE26A', `<@${message.author.id}>, bu video sadece nsfw paylaşımına izin verilen kanala yüklenebilir.`, false, 10000);
                    }
    
                if (coub.duration < 5) coub.duration = 10;

                await coub.loop(10);
                await coub.attachAudio();
                await coub.addOption('-t', coub.duration);
                await coub.write(file);
    
                const coubVideo = new MessageAttachment(file, 'amkanimecisi-coub-video.mp4');
                return message.channel.send(coubVideo).then(() => {
                    fs.unlinkSync(file);
                    msg.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
    
                    var videoUploaded = new MessageEmbed()
                        .setColor('RANDOM')
                        .setDescription(`Coub videosu yüklendi.\nTarayıcıda görüntülemek için [buraya](https://coub.com/view/${coub.metadata.permalink}) tıklayın.`)
                        .setAuthor(coub.metadata.title, coub.metadata.small_picture)
                        .setTimestamp()
                        .setFooter(message.author.username + '#' + message.author.discriminator);
    
                    message.channel.send(videoUploaded);
                });
            } catch (error) {
                msg.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
                return infoMsg(message, 'FFE26A', `<@${message.author.id}>, coub video bağlantısı geçersiz.`, false, 10000);   
            }
        });
    }
}