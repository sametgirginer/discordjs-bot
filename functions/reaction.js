const { querySelect, querySelectBool } = require('./database');

module.exports = {
    react: async function(message) {    
        if (await querySelectBool(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'sunucutanitim'`)) {
            valArray = JSON.parse(JSON.stringify(await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'sunucutanitim'`)));
            valArray = valArray.value.split(",");
            valArray.forEach(async ch => {
                if (message.channel.id === ch) {
                    if (!message.content.startsWith(prefix + 'mc'))
                        await message.delete();
                }
            });
        }
    },

    reactionAdd: async function(reaction, user) {
        if (user && !user.bot && reaction.message.channel.guild) {
            if (reaction.message.channel.name === "kayıt") {
                if (reaction.emoji.name == "✅") {
                    let r = reaction.message.guild.roles.cache.find(r => r.name == "🍁");
                    let r2 = reaction.message.guild.roles.cache.find(r => r.name == "Yeni");
                    await reaction.message.guild.members.cache.find(u=> u.id == user.id).roles.add(r).catch(console.error);
                    await reaction.message.guild.members.cache.find(u=> u.id == user.id).roles.remove(r2).catch(console.error);
                }
            }
        }
    },

    reactionRemove: async function(reaction, user) {
        //
    }
}