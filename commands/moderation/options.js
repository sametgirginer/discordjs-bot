const { MessageEmbed } = require('discord.js');
const db = require('../../functions/database');
const { channelCheck } = require('../../functions/channels');
const { infoMsg } = require('../../functions/message');
const { buildText } = require('../../functions/language');

module.exports = {
    name: 'options',
    aliases: ['opts'],
    category: 'moderation',
    description: 'options_desc',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: ['MANAGE_GUILD'],
    run: async (client, message, args) => {
        /* 
            HELP MESSAGE
        */
        if (args[0] === 'help') {
            var helpMsg = new MessageEmbed()
                .setColor('#65bff0')
                .addField(await buildText("options_help_title_info", client, { guild: message.guild.id }), await buildText("options_help_desc_info", client, { guild: message.guild.id }), false)
                .addField(await buildText("options_help_title_channel", client, { guild: message.guild.id }), await buildText("options_help_desc_channel", client, { guild: message.guild.id }), true)
                .addField(await buildText("options_help_title_guild", client, { guild: message.guild.id }), await buildText("options_help_desc_guild", client, { guild: message.guild.id }), true)

            message.channel.send({ embeds: [helpMsg] });
            message.delete();
        }

        if (!args.length) return infoMsg(message, 'EF3A3A', await buildText("options_arg_required", client, { guild: message.guild.id, message: message }))

        /*
            CHANNEL SETTINGS
        */
        if (args[0] === 'joinchannel' || args[0] === 'leavechannel') {
            if (args[1]) {
                if (channelCheck(message, args[1])) {
                    args[1] = args[1].replace(/[#<>]/g, "");

                    if (await getSetting(message.guild.id) === 0) {
                        let data = `{"${args[0]}":"${args[1]}"}`;

                        db.queryInsert(`INSERT INTO discord_settings (guild, data) VALUES ('${message.guild.id}', '${data}')`);
                        infoMsg(message, '65ed3b', await buildText("options_channel_set", client, { guild: message.guild.id, variables: [args[0], args[1]] }));
                    } else {
                        let data = JSON.parse((await db.querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}'`)).data);

                        if (data[args[0]]) {
                            if (data[args[0]] == args[1]) {
                                return infoMsg(message, 'FFE26A', await buildText("options_channel_already_set", client, { guild: message.guild.id, variables: [args[0], data[args[0]]] }));
                            } else {
                                data[args[0]] = args[1];
                                data = JSON.stringify(data);

                                db.queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                                infoMsg(message, '65ed3b', await buildText("options_channel_updated", client, { guild: message.guild.id, variables: [args[0]] }));
                            }
                        } else {
                            data[args[0]] = args[1];
                            data = JSON.stringify(data);

                            db.queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                            infoMsg(message, '65ed3b', await buildText("options_channel_set", client, { guild: message.guild.id, variables: [args[0], args[1]] }));
                        }
                    }
                } else {
                    infoMsg(message, 'FFE26A', await buildText("options_channel_notfound", client, { guild: message.guild.id }));
                }
            } else {
                infoMsg(message, 'FFE26A', await buildText("options_channel_required", client, { guild: message.guild.id }));
            }
        }

        /*
            GUILD SETTINGS
        */
        if (args[0] === 'lang') {
            if (args[1] == "en" || args[1] == "tr") {
                if (await getSetting(message.guild.id) === 0) {
                    let data = `{"${args[0]}":"${args[1]}"}`;

                    db.queryInsert(`INSERT INTO discord_settings (guild, data) VALUES ('${message.guild.id}', '${data}')`);
                } else {
                    let data = JSON.parse((await db.querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}'`)).data);

                    data[args[0]] = args[1];
                    data = JSON.stringify(data);

                    db.queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                }
                
                infoMsg(message, '65ed3b', await buildText("options_lang_set", client, { guild: message.guild.id, variables: [args[1]] }));
            } else {
                infoMsg(message, 'FFE26A', await buildText("options_lang_required", client, { guild: message.guild.id }));
            }
        }

        /*
            DELETE SETTING
        */
        if (args[0] === 'delete') {
            if(args[1]) {
                if (await getSetting(message.guild.id)) {
                    let data = JSON.parse((await db.querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}'`)).data);

                    if (data[args[1]] == undefined) return infoMsg(message, 'FFE26A', await buildText("options_delete_notfound", client, { guild: message.guild.id, variables: [args[1]] }));

                    delete data[args[1]];
                    data = JSON.stringify(data);

                    if (data == "{}") db.queryDelete(`DELETE FROM discord_settings WHERE guild = '${message.guild.id}'`);
                    else db.queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                    infoMsg(message, '65ed3b', await buildText("options_delete_successful", client, { guild: message.guild.id, variables: [args[1]] }));
                } else {
                    infoMsg(message, 'FFE26A', await buildText("options_guild_opts_not_set", client, { guild: message.guild.id }));
                }
            }
        }
    }
}