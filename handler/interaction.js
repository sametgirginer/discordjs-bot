const { buildText } = require("../functions/language");

module.exports = {
    interactionCreate: async function(client, interaction) {
        if (!interaction.isCommand()) return;

        let command = client.slashCommands.get(interaction.commandName);

        if (command) {
            try {
                command.run(client, interaction);
            } catch (error) {
                console.log(` > ${await buildText("error", client, { guild: interaction.guildId })}: ${error}`);
                interaction.reply(await buildText("command_error", client, { guild: interaction.guildId }));
            }
        } else {
            await interaction.reply(await buildText("interaction_command_not_found", client, { guild: interaction.guildId }));
        }
    },
}