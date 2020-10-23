const { infoMsg } = require('../../functions/message');
const { MessageEmbed } = require('discord.js');
const inviteLink = "https://discord.com/api/oauth2/authorize?client_id=608698125363707905&permissions=8&scope=bot";

module.exports = {
    name: 'invite',
    aliases: ['davet',],
    category: 'info',
    description: 'Botu sunucunuza eklemek için gereken davet bağlantısını iletir.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['SEND_MESSAGES'],
    run: async (client, message, args) => {
        var inviteEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setAuthor(client.user.username, client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 }))
            .setURL(inviteLink)
            .setTitle('Discord botunu davet etmek için buraya tıkla.')
            .setDescription('Discord botunun destek sunucusu: **discord.gg/amkanimecisi**')
            .setTimestamp()
            .setFooter(message.author.username + '#' + message.author.discriminator + ' tarafından kullanıldı.');

        message.channel.send(inviteEmbed);
    }
}