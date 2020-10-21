const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'eval',
    category: 'moderasyon',
    description: 'eval command',
    prefix: false,
    owner: true,
    supportserver: false,
    permissions: ['ADMINISTRATOR'],
    run: async (client, message, args) => {
        try {
            const code = args.join(" ");
            let evaled = eval(code);
           
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
           
            message.channel.send(clean(evaled), { code:"xl" });
        } catch (error) {
            infoMsg(message, 'B20000', `**HATA**:\n${clean(error)}`);
        }
    }
}

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}