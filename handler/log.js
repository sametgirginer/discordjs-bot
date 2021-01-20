const { infoMsg } = require('../functions/message');
const { errorLog } = require('../functions/logger');

module.exports = {
    sendError: async function(error, message) {
        errorLog(message, error);
        console.log(` > Hata: ${error.name} - ${error.message}`)
        if (error.message === "Missing Access") 
            return infoMsg(message, 'D52525', `Bu işlem için gereken izin bota verilmemiş.\n${error.name} - ${error.message}`);
    }
}