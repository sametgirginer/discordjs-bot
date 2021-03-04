const { sleep } = require("../helpers");

module.exports = {
    check: async function(client, loop) {
        if (loop) {
            while (true) {
                let vc = await client.voice.connections;
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