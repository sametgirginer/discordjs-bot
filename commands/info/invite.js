const { MessageActionRow, MessageButton } = require('discord.js');
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
        const inviteButton = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle('LINK')
                .setLabel('Davet Et')
                .setURL(inviteLink)
        );

        message.channel.send({ content: '** **', components: [inviteButton], allowedMentions: { RepliedUser: false } });
    }
}