const { infoMsg } = require('../functions/message');
const { buildText } = require('../functions/language');
const { errorLog } = require('../functions/logger');

module.exports = {
    sendError: async function(client, error, message) {
        errorLog(client, message, error);
        console.log(` > ${await buildText("error", client, { guild: message.guild.id })}: ${error.name} - ${error.message}`);
        return infoMsg(message, 'D52525', `${await buildText("error", client, { guild: message.guild.id })}:` + "`" + error.name + " - " + error.message + "`");
    }
}