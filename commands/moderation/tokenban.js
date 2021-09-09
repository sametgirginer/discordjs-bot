const { infoMsg } = require('../../functions/message.js');
const { querySelectAll, queryDelete } = require('../../functions/database.js');

module.exports = {
    name: 'tokenban',
    aliases: ['tban'],
    category: 'moderasyon',
    description: 'Otomatik olarak bir davetten gelenleri banlar.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['ADMINISTRATOR'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'B20000', `<@${message.author.id}>, herhangi bir id girmedin.`, true, 5000);
        
        let tokens = await querySelectAll(`SELECT user FROM discord_guildusers WHERE guild = '${message.guild.id}' AND inviter = '${args[0]}'`);

        tokens.forEach(token => {
            message.guild.members.fetch(`${token['user']}`).then(user => {
                user.ban({ days: 7, reason: 'Token sebebiyle yasaklandı.' });
                infoMsg(message, 'RANDOM', `<@${user.id}>, discord sunucusundan yasaklandı.\nSunucudan yasaklayan yetkili: <@${message.author.id}>`, false, 5000);
                queryDelete(`DELETE FROM discord_guildusers WHERE guild = '${message.guild.id}' AND user = '${user.id}'`);
            }).catch(err => {
                if (err.code === 10007) return;
            }) ;
        });
    }
}