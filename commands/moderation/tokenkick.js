const { querySelectAll, queryDelete } = require('../../functions/database');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'tokenkick',
    aliases: ['tkick'],
    category: 'moderation',
    description: 'tokenkick_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: [PermissionFlagsBits.Administrator],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'B20000', await buildText("user_id_required", client, { guild: message.guild.id, message: message }), true, 5000);
        
        let tokens = await querySelectAll(`SELECT user FROM discord_guildusers WHERE guild = '${message.guild.id}' AND inviter = '${args[0]}'`);
        let invites = await message.guild.invites.fetch();
        let raider = await message.guild.members.cache.get(args[0]);

        invites.forEach(async invite => {
            if (invite.inviterId === args[0]) invite.delete();
        });

        if (tokens > 0) {
            tokens.forEach(async token => {
                message.guild.members.fetch(`${token['user']}`).then(async user => {
                    user.kick(await buildText("tokenkick_reason", client, { guild: message.guild.id }));
                    infoMsg(message, 'Random', await buildText("tokenkick_kicked_user", client, { guild: message.guild.id, message: message, variables: [user.id] }), false, 5000);
                    queryDelete(`DELETE FROM discord_guildusers WHERE guild = '${message.guild.id}' AND user = '${user.id}'`);
                }).catch(err => {
                    if (err.code === 10007) return;
                }) ;
            });
        }

        raider.kick(await buildText("tokenkick_reason", client, { guild: message.guild.id }));
        infoMsg(message, 'Random', await buildText("tokenkick_kicked_user", client, { guild: message.guild.id, message: message, variables: [raider.id] }), false, 5000);
    }
}