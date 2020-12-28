const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    category: 'info',
    description: 'Gecikme pingini gösterir.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        const pingingEmbed = new MessageEmbed()
            .setColor('#65bff0')
            .setDescription(`Ping değerleri alınıyor...`)

        const msg = await message.channel.send(pingingEmbed);

        const pingEmbed = new MessageEmbed()
            .setColor('#65bff0')
            .setDescription('Ping değerleri alındı!')
            .addField('Gecikme', `${Math.floor(msg.createdAt - message.createdAt)}ms`, true)
            .addField('API Gecikmesi', `${Math.round(client.ws.ping)}ms`, true)

        msg.edit(pingEmbed);
    }
}