const { querySelect } = require('./database');

module.exports = {
    buildText: async function(textCode, client, { guild = null, message = null, member = null, variables = null } = {}) {
        if (guild) guild = JSON.parse((await querySelect(`SELECT data FROM discord_settings WHERE guild = '${guild}'`)).data).lang;

        let lang = (guild) ? guild : process.env.defaultlang;
        let data = client.langs.get(lang);
        let text = data[textCode];

        if (variables) 
            for (let i = 0; i < variables.length; i++) {
                text = text.replace(`%${i}`, variables[i]);
            }

        let regex = /([${]*([a-zA-Z0-9.'%()]*)[}])/g;
        let match = text.match(regex);
    
        regex = /[${]*([a-zA-Z0-9.'%()]*)[}]/;

        if (match)
            match.forEach(m => {
                m = m.match(regex);

                let evaled = eval(m[1]);
                text = text.replace(m[0], evaled);
            });

        

        return await String(text);
    }
}