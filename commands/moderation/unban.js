const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'unban',
    category: 'moderation',
    description: 'unban_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'B20000', await buildText("unban_id_required", client, { guild: message.guild.id }), true, 5000); 

        let bannedMember;
        try {
            bannedMember = await client.users.fetch(args[0]);
        } catch (error) {
            if(!bannedMember) return infoMsg(message, 'B20000', await buildText("unban_id_incorrect", client, { guild: message.guild.id }), true, 5000); 
        }
    
        try {
            await message.guild.bans.fetch(args[0]);
        } catch(error) {
            return infoMsg(message, 'B20000', await buildText("unban_user_not_banned", client, { guild: message.guild.id }), true, 5000); 
        }
        
        message.guild.members.unban(bannedMember, { reason: await buildText("no_reason", client, { guild: message.guild.id }) })
        return infoMsg(message, '83eb34', await buildText("unban_user_unbanned", client, { guild: message.guild.id, message: message, variables: [bannedMember.id] })); 
    }
}