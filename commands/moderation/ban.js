const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'ban',
    aliases: ['yasakla'],
    category: 'moderasyon',
    description: 'Bir kullanıcıyı sunucudan yasaklar.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!message.mentions.members.size) return infoMsg(message, 'B20000', `<@${message.author.id}>, herhangi bir kişiyi etiketlemedin.`, true, 5000);

        message.mentions.members.forEach(member => {
            if (!member.bannable || member.permissions.has(['BAN_MEMBERS']) || member.permissions.has(['KICK_MEMBERS'])) return infoMsg(message, 'B20000', `<@${message.author.id}>, bu discord kullanıcısını yasaklayamazsın.`, true, 5000);

            if(args[1]) {
                let reason = '';
                args.forEach(arg => {
                    if (`<@!${member.id}>` != arg) reason += `${arg} `;
                });

                member.ban({ days: 7, reason: `Sebep: ${reason}` });
                return infoMsg(message, '83eb34', `<@${member.id}>, discord sunucusundan yasaklandı.\nSunucudan yasaklanma sebebi: **${reason}**\nSunucudan yasaklayan yetkili: <@${message.author.id}>`);
            } else {
                member.ban({ days: 7, reason: 'Sebep girilmedi.' });
                return infoMsg(message, '83eb34', `<@${member.id}>, discord sunucusundan yasaklandı.\nSunucudan yasaklayan yetkili: <@${message.author.id}>`);
            }
        });
    }
}