const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'kick',
    aliases: ['at'],
    category: 'moderasyon',
    description: 'Bir kullanıcıyı sunucudan atar.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['KICK_MEMBERS'],
    run: async (client, message, args) => {
        if (!message.mentions.members.size) return infoMsg(message, 'B20000', `<@${message.author.id}>, herhangi bir kişiyi etiketlemedin.`, true, 5000);

        if (message.mentions.members.size === 1) {
            if (args[1]) {
                message.mentions.members.forEach(member => {
                    if (member.hasPermission(['BAN_MEMBERS']) || member.hasPermission(['KICK_MEMBERS'])) return infoMsg(message, 'B20000', `<@${message.author.id}>, bu discord kullanıcısını atamazsın.`, true, 5000);

                    let reason = '';
                    args.forEach(arg => {
                        if (`<@!${member.id}>` != arg) reason += `${arg} `;
                    });

                    member.kick(`Sebep: ${reason}`);
                    return infoMsg(message, '83eb34', `<@${member.id}>, discord sunucusundan atıldı.\nSunucudan atılma sebebi: **${reason}**\nSunucudan atan yetkili: <@${message.author.id}>`);
                });
            } else {
                message.mentions.members.forEach(member => {
                    member.kick('Sebep girilmedi.');
                    return infoMsg(message, '83eb34', `<@${member.id}>, discord sunucusundan atıldı.\nSunucudan atan yetkili: <@${message.author.id}>`);
                });
            }
        }
    }
}