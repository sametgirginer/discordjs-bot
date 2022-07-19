const { PermissionFlagsBits } = require('discord.js');
const { buildText } = require('../functions/language');
const voice = require('../functions/voice/index');

const wait = require('util').promisify(setTimeout);

module.exports = {
    ready: async function(client, guildInvites) {
        console.log(await buildText("bot_started", client));
        await wait(1000);
    
        client.user.setPresence({
            activities: [
                {
                    name: `📌 ${process.env.prefix}help`,
                }
            ],
            status: 'online',
        });
    
        client.guilds.cache.forEach(async guild => {
            voice.speaking(client, guild, true);
    
            if (guild.members.cache.find(member => member.id == client.user.id).permissions.has(PermissionFlagsBits.ManageGuild))
                await guild.invites.fetch()
                    .then(async invites => {
                        const codeUses = new Map();
                        invites.each(inv => codeUses.set(inv.code, inv.uses));
                        await guildInvites.set(guild.id, codeUses);
                    })
                    .catch(err => console.log(err));
        });
    
        try {
            client.guilds.cache.get('735836120272601120').channels.cache.get('756692193682391111').messages.fetch('756692733665607700'); // Private Server 1
            client.guilds.cache.get('803703371936432219').channels.cache.get('803919202108178475').messages.fetch('803919359776784405'); // Private Server 2
        } catch (error) { }
    }
}