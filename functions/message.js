const { MessageEmbed } = require('discord.js');

module.exports = {
    infoMsg: function(message, hexColor, returnMsg, cmdMsgDel, deleteCooldown) {
        if (hexColor != "RANDOM") hexColor = `#${hexColor}`;
        
        var embed = new MessageEmbed()
            .setColor(hexColor)
            .setDescription(returnMsg)

        if (cmdMsgDel === true)
            deleteMsg(message, 0, 'Otomatik bot işlemi.');
            
        if (deleteCooldown > 0) {
            if (message.channel != undefined)
                message.channel.send(embed).then(msg => {
                    deleteMsg(msg, deleteCooldown, 'Otomatik bot işlemi.');
                });
            else 
                message.send(embed).then(msg => {
                    deleteMsg(msg, deleteCooldown, 'Otomatik bot işlemi.');
                });
        } else {
            if (message.channel != undefined)
                message.channel.send(embed);
            else 
                message.send(embed);
        }
    },

    deleteMsg: function(message, timeout, reason) {
        deleteMsg(message, timeout, reason);
    },
}

function deleteMsg(message, timeout, reason) {
    try {
        message.delete({ timeout: timeout, reason: reason});
    } catch (error) {
        console.log(`Mesaj silme hatası: ${error}`);
    }
}