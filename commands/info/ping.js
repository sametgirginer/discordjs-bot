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
            .setDescription(`Ping değerleri alındı!\nGecikme: **${Math.floor(msg.createdAt - message.createdAt)}ms**`)

        msg.edit(pingEmbed);
    }
}