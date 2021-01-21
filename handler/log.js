const { infoMsg } = require('../functions/message');
const { errorLog } = require('../functions/logger');

module.exports = {
    sendError: async function(client, error, message) {
        errorLog(client, message, error);
        console.log(` > Hata: ${error.name} - ${error.message}`);
        return infoMsg(message, 'D52525', "Hata: `" + error.name + " - " + error.message + "`");
    }
}