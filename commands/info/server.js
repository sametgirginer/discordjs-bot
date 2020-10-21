const { querySelect } = require('../../functions/database.js');
const { getChannel } = require('../../functions/channels.js');
const { infoMsg } = require('../../functions/message.js');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');
const request = require("request");

module.exports = {
    name: 'mcserver',
    aliases: ['mc',],
    category: 'info',
    description: 'Oyun sunucunuzun bilgilerini gösterir.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let serverChannelId = await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'sunucutanitim'`);
        let serverChannel = await getChannel(message, 'id', serverChannelId.value);
        let apiUrl = "http://api.keyubu.net/mc/ping.php?";

        if (!serverChannel) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, herhangi bir sunucu tanıtım kanalı ayarlanmamış.`, true, 10000);
        if (message.channel.id != serverChannel.id) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, bu komutu sadece <#${serverChannel.id}> kanalında çalıştırabilirsin.`, true, 10000);

        if (args[0] && String(args[0]).match(/([a-zA-Z0-9-])+[.]+([a-zA-Z0-9-])+[.]+([a-zA-Z0-9-])+/g)) {
            let ip = String(args[0]).toLowerCase();
            let ipTitle = ip;
            let port = 25565;
            if (String(args[1]).match(/[0-9]+/g)) port = args[1];
            if (port != 25565) { let ipTitle = ip + ":" + port; }
            apiUrl += "ip=" + ip + "&port=" + port;

            request({
                url: apiUrl,
                json: true,
                jsonReplacer: true
            }, async function(err, response, body) {
                if (!err && response.statusCode === 200) {
                    let out = JSON.parse(JSON.stringify(body));
                    if (out.offline === undefined) {
                        let online = out.players.online + '/' + out.players.max;
                        let version = (String(out.version.name).replace(/^[a-zA-Z][§\d]+/g, "")).replace("Requires", "");

                        const mcEmbed = new MessageEmbed()
                            .setColor('#B3D7FE')
                            .setTitle(":boom: " + ipTitle + " :boom:")
                            .addField(':small_orange_diamond: Sunucu Durumu', 'Aktif', true)
                            .addField(':small_orange_diamond: Oyuncu Durumu', online, true)
                            .addField(':small_orange_diamond: Sunucu Sürümü', version, false)
                            .setImage('http://status.mclive.eu/%20/' + ip + '/' + port + '/banner.png')
                            .setTimestamp()
                            .setFooter(message.author.username + '#' + message.author.discriminator);
        
                        await message.channel.send(mcEmbed);
                        message.delete({ timeout: 0, reason: 'Otomatik bot işlemi.' });
                    } else {
                        infoMsg(message, 'FFE26A', `<@${message.author.id}>, minecraft sunucusu aktif değil veya sunucu adresi yanlış.`, true, 10000);
                    }
                } else {
                    infoMsg(message, 'FFE26A', `<@${message.author.id}>, API adresinden veri alınamadı.`, true, 10000);
                }
            });
        } else {
            infoMsg(message, 'FFE26A', '<@' + message.author.id + '>, geçerli bir minecraft sunucu adresi girmelisin. Örnek: `play.keyubu.com`', true, 10000);
        }
    }
}
