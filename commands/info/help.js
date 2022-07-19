const { EmbedBuilder } = require('discord.js');
const { infoMsg, deleteMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'help',
    aliases: ['yardım', 'yardim'],
    category: 'info',
    description: 'help_desc',
    prefix: true,
    owner: false,
    supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
        if (!args.length) {
            var commands = [];
            client.commands.forEach(cmd => {
                if (commands[cmd.category] === undefined) commands[cmd.category] = "`" + cmd.name + "`";
                else commands[cmd.category] += " `" + cmd.name + "`";
            });
    
            var helpEmbed = new EmbedBuilder()
                .setColor('#65bff0')
                .setAuthor({ name: await buildText("help_bot_commands", client, { guild: message.guild.id }), iconURL: client.user.avatarURL({ format: 'png', dynamic: true }) })
                .setDescription(await buildText("help_desc_detailed", client, { guild: message.guild.id }))
                .addFields([
                    { name: await buildText("help_general_commands", client, { guild: message.guild.id }), value: commands.info },
                    { name: await buildText("help_rank_commands", client, { guild: message.guild.id }), value: commands.stats },
                    { name: await buildText("help_music_commands", client, { guild: message.guild.id }), value: commands.music },
                    { name: await buildText("help_mod_commands", client, { guild: message.guild.id }), value: commands.moderation }
                ]);

            message.channel.send({ embeds: [helpEmbed] });
        }

        if (args[0]) {
            var komutAdi;

            client.commands.forEach(cmd => {
                if (args[0] === cmd.name || args[0] === cmd.aliases) komutAdi = args[0];
            });

            if (komutAdi === undefined) {
                infoMsg(message, 'B20000', await buildText("help_invaild_command", client, { guild: message.guild.id, message: message, variables: [args[0]] }), true, 10000);
            } else {
                let yes = await buildText("yes", client, { guild: message.guild.id });
                let no = await buildText("no", client, { guild: message.guild.id });

                let owner = (client.commands.get(args[0]).owner) ? no : yes;
                let support = (client.commands.get(args[0]).supportserver) ? yes : no;

                var cmdEmbed = new EmbedBuilder()
					.setColor('#65bff0')
                    .setAuthor({ name: await buildText("help_command_name", client, { guild: message.guild.id, variables: [args[0]] }), iconURL: client.user.avatarURL({ format: 'png', dynamic: true }) })
                    .setDescription(await buildText(client.commands.get(args[0]).description, client, { guild: message.guild.id }))
                    .addFields([
                        { name: await buildText("help_category", client, { guild: message.guild.id }), value: (client.commands.get(args[0]).category).toString(), inline: false },
                        { name: await buildText("help_only_owner", client, { guild: message.guild.id }), value: owner, inline: false },
                        { name: await buildText("help_only_support", client, { guild: message.guild.id }), value: support, inline: false }
                    ]);

                message.channel.send({ embeds: [cmdEmbed] });
                deleteMsg(message, 5000);
            }
        }
    }
}