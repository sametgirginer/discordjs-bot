const { readdirSync } = require('fs');
const { buildText } = require('../functions/language');

module.exports = async (client) => {
    const langs = readdirSync(`./langs/`).filter(f => f.endsWith('.json'));

    for(let file of langs) {
        let pull = require(`../langs/${file}`);

        if (pull.short_name)
            client.langs.set(pull.short_name, pull);
        else
            continue;
    }

    console.log(await buildText("langfiles_imported", client));
}