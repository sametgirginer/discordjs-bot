const hastebin = require("hastebin-gen");
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'eval',
    category: 'moderation',
    description: 'eval_desc',
    prefix: false,
    owner: true,
    supportserver: false,
    permissions: [PermissionFlagsBits.Administrator],
    run: async (client, message, args) => {
        try {
            const code = args.join(" ");
            let evaled = eval(code);
           
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            if (evaled.length >= 2000) {
                let haste = await hastebin(evaled);
                message.reply({ content: haste, allowedMentions: { repliedUser: false } });
            } else {
                message.reply({ content: clean(evaled), allowedMentions: { repliedUser: false } });
            }           
        } catch (error) {
            infoMsg(message, 'B20000', `**${(await buildText("error", client, { guild: message.guild.id })).toUpperCase()}**:\n${clean(error)}`);
        }
    }
}

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}