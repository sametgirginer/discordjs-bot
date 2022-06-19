const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));
        const slashCommands = [];

        commands.forEach(async file => {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
            } else if (pull.data) {
                client.slashCommands.set(pull.data.name, pull);
                slashCommands.push(pull.data.toJSON());
            }

            if (pull.aliases && Array.isArray(pull.aliases)) 
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        });

        const rest = new REST({ version: '9' }).setToken(process.env.token);

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(process.env.appid),
                    { body: slashCommands },
                );
            } catch (error) {
                console.error(error);
            }
        })();
    });
}