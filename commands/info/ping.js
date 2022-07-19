const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'ping_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: [PermissionFlagsBits.ViewChannel],
    run: async (client, message, args) => {
        const pingingEmbed = new EmbedBuilder()
            .setColor('#65bff0')
            .setDescription(await buildText("ping_getting_value", client, { guild: message.guild.id }))

        const msg = await message.reply({ embeds: [pingingEmbed], allowedMentions: { RepliedUser: false } });

        const pingEmbed = new EmbedBuilder()
            .setColor('#65bff0')
            .setDescription(await buildText("ping_value_received", client, { guild: message.guild.id }))
            .addFields([
                { name: await buildText("ping_api_delay", client, { guild: message.guild.id }), value: `${Math.round(client.ws.ping)}ms` }
            ])

        msg.edit({ embeds: [pingEmbed] });
    }
}