const { EmbedBuilder } = require('discord.js');

module.exports = {
    infoMsg: function(message, color, returnMsg, cmdMsgDel, deleteCooldown, reply = [false, false]) {
        if (color != "Random") color = `${color}`;
        
        var embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(returnMsg)

        if (cmdMsgDel === true)
            deleteMsg(message, 0);
            
        if (deleteCooldown > 0) {
            if (message.channel != undefined)
                message.channel.send({ embeds: [embed] }).then(msg => {
                    deleteMsg(msg, deleteCooldown);
                });
            else 
                message.send(embed).then(msg => {
                    deleteMsg(msg, deleteCooldown);
                });
        } else {
            if (!reply[0]) {
                if (message.channel != undefined)
                    message.channel.send({ embeds: [embed] });
                else 
                    message.send({ embeds: [embed] });
            } else { 
                if (reply[1]) message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
                else message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
            }
        }
    },

    deleteMsg: function(message, timeout) {
        deleteMsg(message, timeout);
    },

}

function deleteMsg(message, timeout) {
    try {
        setTimeout(() => message.delete(), timeout);
    } catch (error) {
        console.log(`functions/messages.js - deleteMsg: ${error}`);
    }
}