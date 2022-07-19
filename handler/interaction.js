const { InteractionType } = require("discord.js");
const { buildText } = require("../functions/language");

module.exports = {
    create: async function(client, interaction) {
        if (!interaction.type === InteractionType.ApplicationCommand) return;

        let command = client.slashCommands.get(interaction.commandName);
        
        if (command) {
            try {
                command.run(client, interaction);
            } catch (error) {
                console.log(` > ${await buildText("error", client, { guild: interaction.guildId })}: ${error}`);
                interaction.reply({ content: await buildText("command_error", client, { guild: interaction.guildId }), ephemeral: true });
            }
        }
    },
}