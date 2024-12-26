const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { buildText } = require('../../functions/language');
const OpenAI = require('openai');
const ai = new OpenAI();

module.exports = {
    run: async (client, interaction) => {
        let chat = "";

        interaction.deferReply().then(async () => {
            try {
                const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });

                fetchedMessages.forEach((msg) => {
                    if (msg.content) chat += `${msg.author.displayName}: ${msg.content}\n`;
                });

                const lines = chat.trim().split("\n");
                let lastSender = null;
                
                const processedLines = lines.map(line => {
                    const [sender, ...messageParts] = line.split(":");
                    const message = messageParts.join(":").trim();
                
                    if (sender === lastSender) {
                        return ` ${message}`; 
                    } else {
                        lastSender = sender;
                        return `${sender}: ${message}`;
                    }
                });

                chat = "";
                processedLines.forEach(line => {
                    chat += line + "\n";
                });

                const completion = await ai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: chat + "\nisimleride katarak basit bir özet oluştur, giriş ve bitiş cümlesi kullanma",
                        },
                    ],
                });

                let result = completion.choices[0].message.content;

                if (result.length > 1999) {
                    const buffer = Buffer.from(result, 'utf-8');
                    const attachment = new AttachmentBuilder(buffer, { name: 'özet.txt' });
                    await interaction.editReply({ content: 'İşte sohbetin özeti:', files: [attachment] });
                } else {
                    await interaction.editReply({ content: `İşte sohbetin özeti:\n> ${result}`});
                }
            } catch (error) {
                console.error('Mesajlar alınırken bir hata oluştu:', error);
                await interaction.editReply({ content: 'hata' });
            }
        });
    },

    data: new SlashCommandBuilder()
        .setName('özetle')
        .setDescription('Son 100 mesajı özetler.')
        .setDMPermission(false)
}