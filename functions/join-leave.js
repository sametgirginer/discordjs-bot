const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { buildText }  = require('./language');
const db = require('./database');
const levelSystem = require('./level');
const pvrole = require('./private-server/role');

module.exports = {
    serverJoin: async function(client, member, guildInvites) {
        try {
            member = await member.guild.members.fetch(member.id);

            let channel = JSON.parse((await db.querySelect(`SELECT data FROM discord_settings WHERE guild = '${member.guild.id}'`)).data).joinchannel;
            let guild = member.guild;
            let msgChannel = guild.channels.cache.find(ch => ch.id === channel);
            let inviteCount = 0;

            /* PRIVATE SERVER */
            let role = guild.roles.cache.find(r => r.name == "Yeni");
            if (role != undefined) await member.roles.add(role).catch(console.error);
            /* PRIVATE SERVER */

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
                if (await db.getInvite(guild.id, member.id) === 0) db.queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${member.guild.id}', '${member.id}', '0', '${usedInvite.inviter.id}')`);
                if (await db.getInvite(guild.id, usedInvite.inviter.id) === 0) db.queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${member.guild.id}', '${usedInvite.inviter.id}', '1', '0')`);
                else {
                    let data = JSON.parse(JSON.stringify(await db.querySelect(`SELECT invitecount FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${usedInvite.inviter.id}'`)));
                    inviteCount = Number(data.invitecount) + 1;
                    db.queryUpdate(`UPDATE discord_guildusers SET invitecount = '${inviteCount}' WHERE guild = '${member.guild.id}' AND user = '${usedInvite.inviter.id}'`);
                }
                
                if (inviteCount === 0) inviteCount = 1;
                var joinEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                    .setAuthor({ name: await buildText("join_message_title", client, { guild: member.guild.id }), iconURL: guild.iconURL({ format: 'png', dynamic: true }) })
                    .setDescription(await buildText("join_message_desc_invite_tracker", client, { guild: member.guild.id, member: member, variables: [guild.name, usedInvite.inviter.id, inviteCount] }))
            } else {
                var joinEmbed = new EmbedBuilder()
                    .setColor('Random')
                    .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                    .setAuthor({ name: await buildText("join_message_title", client, { guild: member.guild.id }), iconURL: guild.iconURL({ format: 'png', dynamic: true }) })
                    .setDescription(await buildText("join_message_desc_no_tracker", client, { guild: member.guild.id, member: member, variables: [guild.name] }))
            }
            msgChannel.send({ embeds: [joinEmbed] });

            //Private Server
            let level = await levelSystem.getLevel(guild.id, member.id);
            pvrole.levelup(guild.id, member.id, level, guild);
        } catch (error) {
            console.log(error);
        }
    },

    serverLeave: async function(client, member, guildInvites) {
        try {
            let channel = JSON.parse((await db.querySelect(`SELECT data FROM discord_settings WHERE guild = '${member.guild.id}'`)).data).leavechannel;
            let guild = member.guild;
            let msgChannel = guild.channels.cache.find(ch => ch.id === channel);
            let inviteCount = 0;
        
            if (!msgChannel) return;
            if (await db.getInvite(guild.id, member.id) === 1) {
                let invdata = JSON.parse(JSON.stringify(await db.querySelect(`SELECT inviter FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${member.id}'`)));
                if (invdata.inviter === 0 || invdata.inviter === null) return;
    
                let data = JSON.parse(JSON.stringify(await db.querySelect(`SELECT invitecount FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${invdata.inviter}'`)));
                inviteCount = Number(data.invitecount) - 1;
    
                db.queryUpdate(`UPDATE discord_guildusers SET invitecount = '${inviteCount}' WHERE guild = '${member.guild.id}' AND user = '${invdata.inviter}'`);
                db.queryDelete(`DELETE FROM discord_guildusers WHERE guild = '${member.guild.id}' AND user = '${member.id}'`);
            }
            
            var leaveEmbed = new EmbedBuilder()
                .setColor('Random')
                .setThumbnail(member.user.avatarURL({ format: 'png', dynamic: true }))
                .setAuthor({ name: await buildText("leave_message_title", client, { guild: member.guild.id }), iconURL: guild.iconURL({ format: 'png', dynamic: true }) })
                .setDescription(await buildText("leave_message_desc", client, { guild: member.guild.id, member: member }))
    
            msgChannel.send({ embeds: [leaveEmbed] });
        } catch (error) {
            console.log(error);
        }
    },

    createInvite: async function(client, invite, guildInvites) {
        try {
            const guild = client.guilds.cache.get(invite.guild.id);
            const channel = await guild.channels.cache.filter(c => c.permissionsFor(client.user).has([PermissionFlagsBits.ManageGuild])).random();

            if (channel) {
                const invites = await invite.guild.invites.fetch();
                const codeUses = new Map();
                
                invites.each(inv => codeUses.set(inv.code, inv.uses));
                guildInvites.set(invite.guild.id, codeUses);
                
                if (await db.getInvite(invite.guild.id, invite.inviter.id) === 0) db.queryInsert(`INSERT INTO discord_guildusers (guild, user, invitecount, inviter) VALUES ('${invite.guild.id}', '${invite.inviter.id}', '0', '0')`);
            }
        } catch (error) {
            console.log(error);
        }
    },

    deleteInvite: async function(client, invite, guildInvites) {
        try {
            guildInvites.delete(invite.guild.id, invite);
        } catch (error) {
            console.log(error);
        }
    }
}