const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { infoMsg } = require('../../functions/message.js');
const { stringShort } = require('../../functions/helpers.js');
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
        message.delete();

        var cooldownEmbed = new MessageEmbed()
            .setColor('#d747ed')
            .setDescription(`<@${message.author.id}>, **coub videosu** hazırlanıyor. Hazır olduğunda yüklenecek.`)
     
        message.channel.send({ embeds: [cooldownEmbed] }).then(async msg => {
            try {
                if (!fs.existsSync(`data/coub`)) fs.mkdirSync('data/coub');

                const file = `data/coub/output-${Math.ceil(Math.random() * 5000)}.mp4`;
                const coub = await Coub.fetch(args[0], "HIGH");
    
                if (coub.metadata.not_safe_for_work === true) 
                    if (message.channel.nsfw === false || message.channel.nsfw === undefined) {
                        msg.delete();
                        return infoMsg(message, 'FFE26A', `<@${message.author.id}>, bu video sadece nsfw paylaşımına izin verilen kanala yüklenebilir.`, false, 10000);
                    }
    
                if (coub.duration < 5) coub.duration = 10;

                await coub.loop(10);
                await coub.attachAudio();
                await coub.addOption('-t', coub.duration);
                await coub.write(file);
    
                const coubVideo = new MessageAttachment(file, 'amkanimecisi-coub-video.mp4');
                const coubButton = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setStyle('LINK')
                        .setLabel(await stringShort(coub.metadata.title, 30))
                        .setURL(`https://coub.com/view/${coub.metadata.permalink}`)
                );

                return message.channel.send({ files: [coubVideo], components: [coubButton] }).then(() => {
                    fs.unlinkSync(file);
                    msg.delete();
                });
            } catch (error) {
                msg.delete();
                return infoMsg(message, 'FFE26A', `<@${message.author.id}>, coub video bağlantısı geçersiz.`, false, 10000);   
            }
        });
    }
}