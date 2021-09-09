const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const { infoMsg } = require("../../functions/message");
const { stringShort } = require('../../functions/helpers');
const { download } = require('../../functions/download');
const request = require("request");
const fs = require('fs');


module.exports = {
    name: 'reddit',
    category: 'data',
    description: 'Reddit sitesinden video indirir.',
    prefix: true,
    owner: false,
    permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let regex = /http(s)?:\/\/(\w.*\.)?reddit\.com\/r\/([a-zA-Z0-9]*?)\/comments\/([a-zA-Z0-9]*?)\/([A-Za-z_0-9]*?)\//;
        if (!regex.test(args[0])) return infoMsg(message, `B20000`, `Reddit bağlantısı yazmanız gereklidir.`);

        url = args[0];
        url = (url.match(regex))[0];
        url = url.substring(0, url.length - 1) + ".json";

        var cooldownEmbed = new MessageEmbed()
            .setColor('#d747ed')
            .setDescription(`<@${message.author.id}>, **reddit videosu** hazırlanıyor. Hazır olduğunda yüklenecek.`)

        message.channel.send({ embeds: [cooldownEmbed] }).then(async msg => {
            request({
                uri: url,
                json: true,
                jsonReplacer: true
            }, async function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    let results = JSON.parse(JSON.stringify(await body));
                    let data = results[0].data.children[0].data;
    
                    if (data.is_video) {
                        if (!fs.existsSync(`data/reddit`)) fs.mkdirSync('data/reddit');
                        let videoClean = data['secure_media']['reddit_video']['fallback_url'];
                        let video = videoClean.replace("?source=fallback", "").replace("720", "480").replace("1080", "480");
                        let file = `data/reddit/output-${Math.ceil(Math.random() * 5000)}.mp4`;
    
                        await download(video, file).then(async () => {
                            const redditVideo = new MessageAttachment(file, 'amkanimecisi-reddit-video.mp4');
                            const redditButtons = new MessageActionRow().addComponents(
                                new MessageButton()
                                    .setStyle('LINK')
                                    .setLabel(`Reddit`)
                                    .setURL(`https://reddit.com/${data['permalink']}`),
                                
                                new MessageButton()
                                    .setStyle('LINK')
                                    .setLabel('Video')
                                    .setURL(videoClean)
                            );

                            return message.channel.send({ files: [redditVideo], components: [redditButtons] }).then(() => {
                                msg.delete();
                                fs.unlinkSync(file);
                            });
                        }).catch(e => {
                            msg.delete();
                            fs.unlinkSync(file);
                            infoMsg(message, 'RANDOM', `Reddit videosu indirilemedi veya dosya boyutu yüksek olduğu için yüklenemedi.`, true, 10000)
                        });
                    
                    } else {
                        msg.delete();
                        infoMsg(message, 'RANDOM', `Reddit bağlantısında video bulunamadı.`, true, 10000);
                    }
                } else {
                    msg.delete();
                    return infoMsg(message, 'B20000', `<@${message.author.id}>, veri çekme işleminde bir hata oluştu.`, true, 10000)
                }
            });
        })
    }
}