const { infoMsg } = require('../../functions/message.js');
const { getXP } = require('../../functions/level');

module.exports = {
    name: 'prm',
    category: 'moderasyon',
    description: 'Belirttiğiniz xp değerinden düşük xpsi olan sunucudaki kullanıcıları getirir.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['MANAGE_SERVER'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'B20000', `<@${message.author.id}>, xp değeri girin.`, true, 5000);

        let data = "";
        let xp = parseInt(args[0]);

        message.guild.members.cache.forEach(async m => {
            mxp = await getXP(message.guild.id, m.id);

            if ((mxp === undefined && !m.user.bot) || (mxp != undefined && mxp <= xp))
                data += `<@${m.id}> - XP: ${mxp}\n`;

            if (data.length >= 1900) {
                message.channel.send({ content: data });
                data = "";
            }
        });

        if (data.length > 0) message.channel.send({ content: data });
    }
}