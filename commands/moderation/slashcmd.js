const { PermissionFlagsBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

const rest = new REST({ version: '10' }).setToken(process.env.token);
const slashCommands = [];

module.exports = {
    name: 'scmd',
    category: 'moderation',
    description: 'scmd_desc',
    prefix: true,
    owner: true,
    supportserver: false,
    permissions: [PermissionFlagsBits.Administrator],
    run: async function(client, message, args) {
        if (!args) return infoMsg(message, 'Random', await buildText("scmd_args", client, { guild: message.guild.id }), true, 5000);

        if (args[0] === "delete") {
            rest.put(Routes.applicationGuildCommands(process.env.appid, message.guild.id), { body: [] })
                .then(async () => {
                    return infoMsg(message, 'Random', await buildText("scmd_delete", client, { guild: message.guild.id }), true); 
                })
                .catch(async () => {
                    return infoMsg(message, 'Random', await buildText("scmd_error", client, { guild: message.guild.id }), true, 5000);
                });
        } else if (args[0] === "update") {
            client.slashCommands.forEach(cmd => {
                slashCommands.push(cmd.data.toJSON());
            });
            
            rest.put(Routes.applicationGuildCommands(process.env.appid, message.guild.id), { body: slashCommands })
                .then(async () => {
                    return infoMsg(message, 'Random', await buildText("scmd_update", client, { guild: message.guild.id }), true); 
                })
                .catch(async () => {
                    return infoMsg(message, 'Random', await buildText("scmd_error", client, { guild: message.guild.id }), true, 5000);
                });
        } else {
            return infoMsg(message, 'Random', await buildText("scmd_args", client, { guild: message.guild.id }), true, 5000);
        }
    },
}