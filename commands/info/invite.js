const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buildText } = require('../../functions/language');
const inviteLink = "https://discord.com/api/oauth2/authorize?client_id=608698125363707905&permissions=8&scope=bot";

module.exports = {
    name: 'invite',
    aliases: ['davet'],
    category: 'info',
    description: 'invite_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['SEND_MESSAGES'],
    run: async (client, message, args) => {
        const inviteButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(await buildText("invite_label", client, { guild: message.guild.id }))
                .setURL(inviteLink)
        );

        message.reply({ components: [inviteButton], allowedMentions: { RepliedUser: false } });
    }
}