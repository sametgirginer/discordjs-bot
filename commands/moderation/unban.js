const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'unban',
    aliases: ['yasakkaldir', 'yskaldir'],
    category: 'moderasyon',
    description: 'Sunucudan yasaklanmış bir kullanıcının yasağını kaldırır.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!args[0]) return infoMsg(message, 'B20000', `Bir **kullanıcı id** girmelisiniz.`, true, 5000); 

        let bannedMember;
        try {
            bannedMember = await client.users.fetch(args[0]);
        } catch (error) {
            if(!bannedMember) return infoMsg(message, 'B20000', `Girdiğiniz **kullanıcı id** yanlış.`, true, 5000); 
        }
    
        try {
            await message.guild.fetchBan(args[0]);
        } catch(error) {
            return infoMsg(message, 'B20000', `Kullanıcı bulundu ancak yasaklı değil.`, true, 5000); 
        }
        
        message.guild.members.unban(bannedMember, {reason: `Sebep girilmedi.`})
        return infoMsg(message, '83eb34', `<@${bannedMember.id}> discord kullanıcısının yasağını <@${message.author.id}> kaldırıldı.`); 
    }
}