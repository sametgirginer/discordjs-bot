const { MessageEmbed } = require('discord.js');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'ping_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        const pingingEmbed = new MessageEmbed()
            .setColor('#65bff0')
            .setDescription(await buildText("ping_getting_value", client, { guild: message.guild.id }))

        const msg = await message.reply({ embeds: [pingingEmbed], allowedMentions: { RepliedUser: false } });

        const pingEmbed = new MessageEmbed()
            .setColor('#65bff0')
            .setDescription(await buildText("ping_value_received", client, { guild: message.guild.id }))
            .addField(await buildText("ping_api_delay", client, { guild: message.guild.id }), `${Math.round(client.ws.ping)}ms`, true)

        msg.edit({ embeds: [pingEmbed] });
    }
}