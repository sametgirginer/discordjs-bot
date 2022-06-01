const { infoMsg } = require('../functions/message');
const { writeLog } = require('../functions/logger')
const { permCheck } = require('../functions/permission');
const { autoResponse } = require('../functions/autoresponse');
const levelSystem = require('../functions/level');
const prefix = process.env.prefix;

module.exports = {
    create: async function(client, message) {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.member) message.member = await message.guild.members.fetch();
    
        writeLog(message);
        autoResponse(message);
        levelSystem.updateMessageXP(message);
    
        if (!message.content.startsWith(prefix)) {
            const args = message.content.trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
    
            let command = client.commands.get(cmd);    
            if (!command) command = client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    
            if (command && !command.prefix && command.supportserver === true && message.guild.id != process.env.supportserver)
                return infoMsg(message, '65bff0', `<@${message.author.id}>, bu komut sadece botun **discord destek** sunucusunda kullanılabilir.`, true, 5000);
            
            if ((command && !command.owner && !command.prefix) || (command && command.owner && message.author.id === process.env.ownerid && !command.prefix)) {
                try {
                    if (!permCheck(message, command.permissions)) return infoMsg(message, 'EF3A3A', `<@${message.author.id}>, bu komutu kullanmak için maalesef yetkiniz yok.`);
                    command.run(client, message, args);
                } catch (error) {
                    console.log(` > HATA: ${error}`);
                    infoMsg(message, '000', `Komut çalıştırılırken bir hata oluştu.`, true, 10000);
                }
            } else return;
        } else {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
    
            if (cmd.length === 0) return;
    
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    
            if (command && command.supportserver === true && message.guild.id != process.env.supportserver)
                return infoMsg(message, '65bff0', `<@${message.author.id}>, bu komut sadece botun **discord destek** sunucusunda kullanılabilir.`, true, 8000);
    
            if ((command && !command.owner && command.prefix) || (command && command.owner && message.author.id === process.env.ownerid && command.prefix)) {
                try {
                    if (!permCheck(message, command.permissions)) return infoMsg(message, 'EF3A3A', `<@${message.author.id}>, bu komutu kullanmak için maalesef yetkiniz yok.`);
                    command.run(client, message, args);
                } catch (error) {
                    console.log(` > HATA: ${error}`);
                    infoMsg(message, '000', `Komut çalıştırılırken bir hata oluştu.`, true, 10000);
                }
            } else return;
        }
    },

    reactionAdd: async function(reaction, user) {
        if (user && !user.bot && reaction.message.channel.guild) {
            if (reaction.message.channel.name === "kayıt") {
                if (reaction.emoji.name == "✅") {
                    console.log(reaction);
                    console.log(user);
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