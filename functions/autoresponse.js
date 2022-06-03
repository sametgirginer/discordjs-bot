const fs = require('fs');
var data = fs.readFileSync('data/answers.json');
data = JSON.parse(data);

module.exports = {
    autoResponse: async function(message) {
        let content = message.content.toLowerCase();

        data.forEach(c => {
            if (Array.isArray(c.content)) {
                c.content.forEach(m => {
                    m = m.toLowerCase();

                    answer = c.answer.replace('@user', `@${message.author.id}`);
                    if (c.search === true) { 
                        if (content.search(m) >= 0) return message.channel.send({ content: answer });
                    } else if (m === content) return message.channel.send({ content: answer });
                });
            } else {
                c.content = c.content.toLowerCase();
                answer = c.answer.replace('@user', `@${message.author.id}`);
                if (c.search === true) {
                    if (content.search(c.content) >= 0) return message.channel.send({ content: answer });
                } else if (c.content === content) return message.channel.send({ content: answer });
            }
        });
    }
}