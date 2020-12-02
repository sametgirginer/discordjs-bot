const { MessageEmbed } = require('discord.js');
const { querySelectAll } = require('../../functions/database');
const levelSystem = require('../../functions/level');

module.exports = {
    name: 'top',
    category: 'stats',
    description: 'En yüksek levele ulaşan kullanıcılar.',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        let top = await querySelectAll(`SELECT * FROM discord_levels WHERE guild = '${message.guild.id}' ORDER BY level DESC`);
        let output = "";
        let sira = 1;

        top.forEach(data => {
            //console.log(data.user);
            output += `${sira}. <@${data.user}> - Level: ${data.level} - XP: ${data.xp}\n`;
            sira++;                       
        });

        if (output) {
            var topEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle(`${message.guild.name} TOP 10`)
                .setDescription(output)
                .setTimestamp()
                .setFooter(message.author.username + '#' + message.author.discriminator)

            message.channel.send(topEmbed);
        }
    }
}