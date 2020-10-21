const { MessageEmbed } = require('discord.js');

module.exports = {
    infoMsg: function(message, hexColor, returnMsg, cmdMsgDel, deleteCooldown) {    
        var embed = new MessageEmbed()
            .setColor('#' + hexColor)
            .setDescription(returnMsg)

        if (cmdMsgDel === true)
            message.delete();
            
        if (deleteCooldown > 0) {
            if (message.channel != undefined)
                message.channel.send(embed).then(msg => {
                    msg.delete({ timeout: deleteCooldown, reason: 'Otomatik bot işlemi.' });
                });
            else 
                message.send(embed).then(msg => {
                    msg.delete({ timeout: deleteCooldown, reason: 'Otomatik bot işlemi.' });
                });
        } else {
            if (message.channel != undefined)
                message.channel.send(embed);
            else 
                message.send(embed);
        }
    },
}