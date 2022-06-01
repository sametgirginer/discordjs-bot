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
}

var conn = mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbname
});

conn.connect(function(err) {
    if (err) throw err;
    console.log(' > MySQL connection successfully completed.');
})