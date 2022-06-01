const { MessageEmbed } = require('discord.js');
const { queryInsert, querySelect, queryUpdate, queryDelete, getSetting } = require('../../functions/database.js');
const { channelCheck } = require('../../functions/channels.js');
const { infoMsg } = require('../../functions/message.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'ayar',
    category: 'moderation',
    description: 'Bot ayarlarını özelleştirin.',
    prefix: true,
    owner: false,
    supportserver: false,
    permissions: [
        'MANAGE_CHANNELS',
        'MANAGE_ROLES',
        'VIEW_AUDIT_LOG',
        'BAN_MEMBERS',
        'KICK_MEMBERS'
    ],
    run: async (client, message, args) => {
        /* 
            HELP MESSAGE - YARDIM MESAJI
        */
        if (args[0] === 'yardım' || args[0] === 'help') {
            var ayarYardim = new MessageEmbed()
            .setColor('#65bff0')
            .addField('**Bilgilendirme Bölümü**', stripIndents`
                    Bot ayarını değiştirmek için: **${process.env.prefix}ayar** [**ayar adı**] [**değer**]
                    Bot ayarını tamamen silmek için: **${process.env.prefix}ayar sil** [**ayar adı**]
                    Herhangi bir ayar için birden fazla kanal eklenebilir.`, false)
            .addField('**Kanal Ayarları**',
                       stripIndents`**${process.env.prefix}ayar joinchannel** _<kanal>_
                                    **${process.env.prefix}ayar leavechannel** _<kanal>_`, true)
            .addField('**Sunucu Ayarları**',
                       stripIndents`**${process.env.prefix}ayar lang** _en,tr_`, true)

            message.channel.send({ embeds: [ayarYardim] });
            message.delete();
        }

        if (!args.length) return infoMsg(message, 'EF3A3A', `<@${message.author.id}>, komut için gereken argümanlar girilmedi.\nArgümanları öğrenmek için: **${process.env.prefix}ayar yardım**`)

        /*
            CHANNEL SETTINGS
        */
        if (args[0] === 'joinchannel' || args[0] === 'leavechannel') {
            if (args[1]) {
                if (channelCheck(message, args[1])) {
                    args[1] = args[1].replace(/[#<>]/g, "");

                    if (await getSetting(message.guild.id) === 0) {
                        let data = `{"${args[0]}":"${args[1]}"}`;

                        queryInsert(`INSERT INTO discord_settings (guild, data) VALUES ('${message.guild.id}', '${data}')`);
                        infoMsg(message, '65ed3b', `**${args[0]}** için başarıyla ayarlama yapıldı.`);
                    } else {
                        let data = JSON.parse((await querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}'`)).data);

                        if (data[args[0]]) {
                            if (data[args[0]] == args[1]) {
                                return infoMsg(message, 'FFE26A', `**${args[0]}** ayarı için <#${data[args[0]]}> kanalı daha önceden ayarlanmış.`);
                            } else {
                                data[args[0]] = args[1];
                                data = JSON.stringify(data);

                                queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                                infoMsg(message, '65ed3b', `**${args[0]}** ayarı başarıyla güncellendi.`);
                            }
                        } else {
                            data[args[0]] = args[1];
                            data = JSON.stringify(data);

                            queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                            infoMsg(message, '65ed3b', `**${args[0]}** ayarı için <#${args[1]}> kanalı ayarlandı.`);
                        }
                    }
                } else {
                    infoMsg(message, 'FFE26A', 'Bu **ID** ile eşelen herhangi bir kanal bulunamadı.');
                }
            } else {
                infoMsg(message, 'FFE26A', `Herhangi bir kanal belirtmediniz. Örnek <kanal>`);
            }
        }

        /*
            GUILD SETTINGS
        */
        if (args[0] === 'lang') {
            if (args[1] == "en" || args[1] == "tr") {
                if (await getSetting(message.guild.id) === 0) {
                    let data = `{"${args[0]}":"${args[1]}"}`;

                    queryInsert(`INSERT INTO discord_settings (guild, data) VALUES ('${message.guild.id}', '${data}')`);
                } else {
                    let data = JSON.parse((await querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}'`)).data);

                    data[args[0]] = args[1];
                    data = JSON.stringify(data);

                    queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                }
                
                infoMsg(message, '65ed3b', `Sunucu için botun dili "**${args[1]}**" olarak başarıyla ayarlandı.`);
            } else {
                infoMsg(message, 'FFE26A', `Herhangi bir dil belirtmediniz. Örnek **en,tr**`);
            }
        }

        /*
            DELETE SETTING
        */
        if (args[0] === 'delete' || args[0] === 'sil') {
            if(args[1]) {
                if (await getSetting(message.guild.id)) {
                    let data = JSON.parse((await querySelect(`SELECT * FROM discord_settings WHERE guild = '${message.guild.id}'`)).data);

                    if (data[args[1]] == undefined) return infoMsg(message, 'FFE26A', `**${args[1]}** ayarı için bir veri bulunamadı.`);

                    delete data[args[1]];
                    data = JSON.stringify(data);

                    if (data == "{}") queryDelete(`DELETE FROM discord_settings WHERE guild = '${message.guild.id}'`);
                    else queryUpdate(`UPDATE discord_settings SET data = '${data}' WHERE guild = '${message.guild.id}'`);
                    infoMsg(message, '65ed3b', `**${args[1]}** ayarı başarıyla silindi.`);
                } else {
                    infoMsg(message, 'FFE26A', `Sunucu ile ilgili herhangi bir ayar bulunamadı.`);
                }
            }
        }
    }
}