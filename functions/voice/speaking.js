const { getVoiceConnection } = require('@discordjs/voice');
const { sleep } = require("../helpers");

module.exports = {
    check: async function(client, guild, loop) {
        if (loop) {
            while (true) {
                let vc = await getVoiceConnection(guild.id);
                console.log(vc);
                let serverQueue = "";

                vc.forEach(async v => {
                    serverQueue = await client.queue.get(v.channel.guild.id);

                    if (v.speaking.bitfield === 0) {
                        v.disconnect();
                    }
                });

                await sleep(300000);
            }
        } else {
            //loop - false
        }
    },
}