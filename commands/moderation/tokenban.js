const { querySelectAll, queryDelete } = require('../../functions/database');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'tokenban',
    aliases: ['tban'],
    category: 'moderation',
    description: 'tokenban_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['ADMINISTRATOR'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'B20000', await buildText("user_id_required", client, { guild: message.guild.id, message: message }), true, 5000);
        
        let tokens = await querySelectAll(`SELECT user FROM discord_guildusers WHERE guild = '${message.guild.id}' AND inviter = '${args[0]}'`);

        tokens.forEach(async token => {
            message.guild.members.fetch(`${token['user']}`).then(async user => {
                user.ban({ days: 7, reason: await buildText("tokenban_reason", client, { guild: message.guild.id }) });
                infoMsg(message, 'RANDOM', await buildText("tokenban_banned_user", client, { guild: message.guild.id, message: message, variables: [user.id] }), false, 5000);
                queryDelete(`DELETE FROM discord_guildusers WHERE guild = '${message.guild.id}' AND user = '${user.id}'`);
            }).catch(err => {
                if (err.code === 10007) return;
            }) ;
        });
    }
}