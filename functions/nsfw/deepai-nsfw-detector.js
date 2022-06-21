/*
    Sadece resimlerde çalışmaktadır. Videoları desteklemez.
    It onyls works on images. Not supports videos.
*/

const { deleteMsg } = require('../message');
const deepai = require('deepai');
deepai.setApiKey(process.env.deepaiKey);

module.exports = {
    check: async function(message) {
        if (message.guild.id === process.env.supportserver) return;

        let srcURL = "";
        if (message.attachments.first() != undefined) {
            srcURL = message.attachments.first().proxyURL;
        } else if (message.embeds.length > 0) {
            if (message.embeds[0].type === "image")
                srcURL = message.embeds[0].thumbnail.url;
            else
                return;
        } else {
            return;
        }

        let resp = await deepai.callStandardApi("nsfw-detector", { image: srcURL });
        let data = resp.output.detections;

        for (let i = 0; i < data.length; i++) {
            if (data[i].name.includes("Exposed")) {
                if (data[i].confidence > 0.30) {
                    deleteMsg(message, 500);
                    break;
                }
            }
        }
    },
}