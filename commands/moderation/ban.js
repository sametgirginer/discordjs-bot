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
        if (!message.mentions.members.size) return infoMsg(message, 'B20000', `<@${message.author.id}>, herhangi bir kişiyi etiketlemedin.`, true, 500);

        if (message.mentions.members.size === 1) {
            if (args[1]) {
                message.mentions.members.forEach(member => {
                    if (member.hasPermission(['BAN_MEMBERS']) || member.hasPermission(['KICK_MEMBERS'])) return infoMsg(message, 'B20000', `<@${message.author.id}>, bu discord kullanıcısını yasaklayamazsın.`, true, 5000);

                    let reason = '';
                    args.forEach(arg => {
                        if (`<@!${member.id}>` != arg) reason += `${arg} `;
                    });

                    member.ban({ days: 7, reason: `Sebep: ${reason}` });
                    return infoMsg(message, '83eb34', `<@${member.id}>, discord sunucusundan yasaklandı.\nSunucudan yasaklanma sebebi: **${reason}**\nSunucudan yasaklayan yetkili: <@${message.author.id}>`);
                });
            } else {
                message.mentions.members.forEach(member => {
                    member.ban({ days: 7, reason: 'Sebep girilmedi.' });
                    return infoMsg(message, '83eb34', `<@${member.id}>, discord sunucusundan yasaklandı.\nSunucudan yasaklayan yetkili: <@${message.author.id}>`);
                });
            }
        }
    }
}