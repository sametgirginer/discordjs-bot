const mysql = require('mysql2');

module.exports = {
    queryInsert: function(cmd) {
        conn.query(cmd, err => {
            if (err) { return console.log(` > MySQL error occurred: ${err}`); }
        });
    },

    querySelectBool: async function(cmd) {
        return new Promise((resolve) => {
            conn.query(cmd, (err, results) => {
                if (err) { return console.log(` > MySQL error occurred: ${err}`); }
    
                if (results.length != 0)
                    resolve(results.length);
                else
                    resolve(0);
            });
        });
    },

    querySelect: async function(cmd) {
        return new Promise((resolve) => {
            conn.query(cmd, (err, results) => {
                if (err) { return console.log(` > MySQL error occurred: ${err}`); }
    
                if (results.length != 0)
                    resolve(JSON.parse(JSON.stringify(results[0])));
                else
                    resolve(0);
            });
        });
    },

    querySelectAll: async function(cmd) {
        return new Promise((resolve) => {
            conn.query(cmd, (err, results) => {
                if (err) { return console.log(` > MySQL error occurred: ${err}`); }
    
                if (results.length != 0)
                    resolve(JSON.parse(JSON.stringify(results)));
                else
                    resolve(0);
            });
        });
    },

    queryUpdate: function(cmd) {
        conn.query(cmd, err => {
            if (err) { return console.log(` > MySQL error occurred: ${err}`); }
        });
    },

    queryDelete: function(cmd) {
        conn.query(cmd, err => {
            if (err) { return console.log(` > MySQL error occurred: ${err}`); }
        });
    },

    /* Database Setting Check */
    getSetting: async function(guild) {
        return new Promise((resolve) => {
            if (guild) {
                conn.query(`SELECT * FROM discord_settings WHERE guild = '${guild}'`, (err, results) => {
                    if (err) { return console.log(` > MySQL error occurred: ${err}`); }
        
                    if (results.length != 0)
                        resolve(results.length);
                    else
                        resolve(0);
                });
            } else {
                resolve(null);
            }
        });
    },

    /* Database Invite Check */
    getInvite: async function(guildID, userID) {
        return new Promise((resolve) => {
            if (guildID && userID) {
                conn.query(`SELECT * FROM discord_guildusers WHERE guild = '${guildID}' AND user = '${userID}'`, (err, results) => {
                    if (err) { return console.log(` > MySQL error occurred: ${err}`); }
        
                    if (results.length != 0)
                        resolve(results.length);
                    else
                        resolve(0);
                });
            } else {
                resolve(null);
            }
        });
    },

    buildDatabase: async function() {
        conn.promise().query("SELECT * FROM discord_guildusers")
        .catch(error => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                conn.query("CREATE TABLE IF NOT EXISTS `discord_guildusers` (`id` int(11) NOT NULL, `guild` varchar(50) NOT NULL, `user` varchar(50) NOT NULL, `invitecount` int(11) NOT NULL DEFAULT 0, `inviter` varchar(50) NOT NULL DEFAULT '0') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
                conn.query("ALTER TABLE `discord_guildusers` ADD PRIMARY KEY (id);");
                conn.query("ALTER TABLE `discord_guildusers` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;");
            }
        });

        conn.promise().query("SELECT * FROM discord_levels")
        .catch(error => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                conn.query("CREATE TABLE `discord_levels` (`id` int(11) NOT NULL, `guild` varchar(50) NOT NULL, `user` varchar(50) NOT NULL, `xp` double NOT NULL DEFAULT 0, `xplimit` int(11) NOT NULL DEFAULT 500, `level` int(11) NOT NULL DEFAULT 0) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
                conn.query("ALTER TABLE `discord_levels` ADD PRIMARY KEY (id);");
                conn.query("ALTER TABLE `discord_levels` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;");
            }
        });

        conn.promise().query("SELECT * FROM discord_settings")
        .catch(error => {
            if (error && error.code === "ER_NO_SUCH_TABLE") {
                conn.query("CREATE TABLE `discord_settings` (`guild` varchar(50) NOT NULL, `data` text NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
                conn.query("ALTER TABLE `discord_settings` ADD PRIMARY KEY (guild);");
            }
        });
    },
}

var conn = mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbname
});

conn.connect(function(err) {
    if (err) return console.log(`DB ERROR: ${err.sqlMessage}`);

    module.exports.buildDatabase();
    console.log(' > MySQL connection successful.');
})