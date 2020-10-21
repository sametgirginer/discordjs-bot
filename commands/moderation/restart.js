const { infoMsg } = require('../../functions/message.js');

module.exports = {
    name: 'restart',
    aliases: ['yb', 'yenidenbaslat'],
    category: 'moderasyon',
    description: 'Botu yeniden başlatır.',
    prefix: true,
    owner: true,
    supportserver: false,
    permissions: ['ADMINISTRATOR'],
    run: async (client, message, args) => {
        infoMsg(message, '65ed3b', `<@${message.author.id}>, bot yeniden başlatılıyor...`);
        setInterval(() => {
            process.exit(1);
        }, 2000);
    }
}