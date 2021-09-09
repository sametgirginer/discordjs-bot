const { sleep } = require("../helpers");
const level = require("../level");

module.exports = {
    update: async function(client, loop) {
        if (loop) {
            while (true) {
                await sleep(60000);

                client.guilds.cache.forEach(guild => {
                    guild.channels.cache.forEach(channel => {
                        if (channel.type === "GUILD_VOICE") {
                            channel.members.forEach(member => {                            
                                if (!member.user.bot) {
                                    if (!member.voice.deaf) {
                                        level.updateVoiceXP(guild, channel, member);
                                    }
                                }
                            });
                        }
                    });
                });
            }
        } else {
            //loop - false
        }
    },
}