const { MessageEmbed } = require('discord.js');
const { queryInsert, querySelect, queryUpdate, queryDelete, getInvite } = require('./database.js');
const levelSystem = require('./level');
const pvrole = require('./private-server/role');

module.exports = {
    serverJoin: async function(member, guildInvites) {
        try {
            member = await member.guild.members.fetch(member.id);

            let channel = JSON.parse((await querySelect(`SELECT data FROM discord_settings WHERE guild = '${member.guild.id}'`)).data).joinchannel;
            let guild = member.guild;
            let msgChannel = guild.channels.cache.find(ch => ch.id === channel);
            let inviteCount = 0;

            let role = guild.roles.cache.find(r => r.name == "Yeni");
            if (role != undefined) await member.roles.add(role).catch(console.error);

            if (!msgChannel) return;
    
            /* INVITE TRACKER */
            const cachedInvites = await guildInvites.get(member.guild.id);
            const newInvites = await member.guild.invites.fetch();
            var usedInvite = undefined;
            if (cachedInvites) {
                usedInvite = await newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
                await newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
            }
            guildInvites.set(member.guild.id, cachedInvites);
            /* INVITE TRACKER */

            levelSystem.dbCheck(guild, member);

            if (usedInvite != undefined) {
                if (await getInvite(guild.id, member.id) === 0) queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${member.guild.id}', '${member.id}', '0', '${usedInvite.inviter.id}')`);
                if (await getInvite(guild.id, usedInvite.inviter.id) === 0) queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${member.guild.id}', '${usedInvite.inviter.id}', '1', '0')`);
                else {
                    let data = JSON.parse(JSON.stringify(await querySelect(`SELECT invitecount FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${usedInvite.inviter.id}'`)));
                    inviteCount = Number(data.invitecount) + 1;
                    queryUpdate(`UPDATE discord_guildusers SET invitecount = '${inviteCount}' WHERE guild = '${member.guild.id}' AND user = '${usedInvite.inviter.id}'`);
                }
                
                if (inviteCount === 0) inviteCount = 1;
                var joinEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                    .setAuthor({ name: `Hoş geldin!`, iconURL: guild.iconURL({ format: 'png', dynamic: true }) })
                    .setDescription(`<@${member.user.id}>, **${guild.name}** discord sunucusuna hoş geldin.\nDavet eden: <@${usedInvite.inviter.id}> (**${inviteCount}** davet)`)
            } else {
                var joinEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                    .setAuthor({ name: `Hoş geldin!`, iconURL: guild.iconURL({ format: 'png', dynamic: true }) })
                    .setDescription(`<@${member.user.id}>, **${guild.name}** discord sunucusuna hoş geldin.`)
            }
            msgChannel.send({ embeds: [joinEmbed] });

            //Private Server
            let level = await levelSystem.getLevel(guild.id, member.id);
            pvrole.levelup(guild.id, member.id, level, guild);
        } catch (error) {
            console.log(error);
        }
    },

    serverLeave: async function(member, guildInvites) {
        try {
            let channel = JSON.parse((await querySelect(`SELECT data FROM discord_settings WHERE guild = '${member.guild.id}'`)).data).leavechannel;
            let guild = member.guild;
            let msgChannel = guild.channels.cache.find(ch => ch.id === channel);
            let inviteCount = 0;
        
            if (!msgChannel) return;
            if (await getInvite(guild.id, member.id) === 1) {
                let invdata = JSON.parse(JSON.stringify(await querySelect(`SELECT inviter FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${member.id}'`)));
                if (invdata.inviter === 0 || invdata.inviter === null) return;
    
                let data = JSON.parse(JSON.stringify(await querySelect(`SELECT invitecount FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${invdata.inviter}'`)));
                inviteCount = Number(data.invitecount) - 1;
    
                queryUpdate(`UPDATE discord_guildusers SET invitecount = '${inviteCount}' WHERE guild = '${member.guild.id}' AND user = '${invdata.inviter}'`);
                queryDelete(`DELETE FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${member.id}'`);
            }
            
            var leaveEmbed = new MessageEmbed()
                .setColor('RANDOM')
                .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                .setAuthor({ name: `Görüşürüz!`, iconURL: guild.iconURL({ format: 'png', dynamic: true }) })
                .setDescription(`${member.user.tag}, discord sunucusundan ayrıldı.\nAramıza tekrar katılman dileğiyle.`)
    
            msgChannel.send({ embeds: [leaveEmbed] });
        } catch (error) {
            console.log(error);
        }
    },

    createInvite: async function(invite, guildInvites) {
        try {
            const invites = await invite.guild.invites.fetch();
            const codeUses = new Map();
            
            invites.each(inv => codeUses.set(inv.code, inv.uses));
            guildInvites.set(invite.guild.id, codeUses);

            if (await getInvite(invite.guild.id, invite.inviter.id) === 0) queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${invite.guild.id}', '${invite.inviter.id}', '0', '0')`);
        } catch (error) {
            console.log(error);
        }
    },

    deleteInvite: async function(invite, guildInvites) {
        try {
            guildInvites.delete(invite.guild.id, invite);
        } catch (error) {
            console.log(error);
        }
    }
}