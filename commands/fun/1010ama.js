const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');
const ai = new OpenAI();

module.exports = {
    run: async (client, interaction) => {
        interaction.deferReply().then(async () => {
            try {
                const completion = await ai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "user",
                            content: "10/10 ama ile başlayan kişi özelliği belirt. Örnek: 10/10 ama film izlerken sürekli spoiler veren biri. Sadece tek bir cümle olsun yorum katma. Çok ilginç veya absürt şeyler yazabilirsin.",
                        },
                    ],
                });

                let result = completion.choices[0].message.content;
                await interaction.editReply({ content: result});   
            } catch (error) {
                console.error('Soru oluşturulurken bir hata oluştu: ', error);
                await interaction.editReply({ content: 'Soru oluşturulurken bir hata oluştu.' });
            }
        });
	},

	data: new SlashCommandBuilder()
		.setName('1010ama')
		.setDescription('"10/10 ama" ile başlayan cümle üretir.')
		.setDMPermission(true)
};