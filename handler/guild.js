const db = require('../functions/database');

module.exports = {
    create: async function(client, guild) {
        let data = `{"lang":"en"}`;
        db.queryInsert(`INSERT INTO discord_settings (guild, data) VALUES ('${guild.id}', '${data}')`);
    },

    delete: async function(client, guild) {
        db.queryDelete(`DELETE FROM discord_settings WHERE guild = '${guild.id}'`);
    },
}