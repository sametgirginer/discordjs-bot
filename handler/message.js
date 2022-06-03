const { infoMsg } = require('../functions/message');
const { buildText } = require('../functions/language');
const { writeLog } = require('../functions/logger');
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
                return infoMsg(message, '65bff0', await buildText("command_only_support_server", client, { guild: message.guild.id, message: message }), true, 5000);
            
            if ((command && !command.owner && !command.prefix) || (command && command.owner && message.author.id === process.env.ownerid && !command.prefix)) {
                try {
                    if (!permCheck(message, command.permissions)) return infoMsg(message, 'EF3A3A', await buildText("command_no_permission", client, { guild: message.guild.id, message: message }));
                    command.run(client, message, args);
                } catch (error) {
                    console.log(` > ${await buildText("error", client, { guild: message.guild.id })}: ${error}`);
                    infoMsg(message, '000', await buildText("command_error", client, { guild: message.guild.id }), true, 10000);
                }
            } else return;
        } else {
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
    
            if (cmd.length === 0) return;
    
            let command = client.commands.get(cmd);
            if (!command) command = client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    
            if (command && command.supportserver === true && message.guild.id != process.env.supportserver)
                return infoMsg(message, '65bff0', await buildText("command_only_support_server", client, { guild: message.guild.id, message: message }), true, 8000);
    
            if ((command && !command.owner && command.prefix) || (command && command.owner && message.author.id === process.env.ownerid && command.prefix)) {
                try {
                    if (!permCheck(message, command.permissions)) return infoMsg(message, 'EF3A3A', await buildText("command_no_permission", client, { guild: message.guild.id, message: message }));
                    command.run(client, message, args);
                } catch (error) {
                    console.log(` > ${await buildText("error", client, { guild: message.guild.id })}: ${error}`);
                    infoMsg(message, '000', await buildText("command_error", client, { guild: message.guild.id }), true, 10000);
                }
            } else return;
        }
    },

    reactionAdd: async function(reaction, user) { // This function currently only works for private server. You can edit it according to you.
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