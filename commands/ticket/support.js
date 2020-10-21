const { querySelect } = require('../../functions/database.js');
const { MessageEmbed } = require('discord.js');
const { getChannel } = require('../../functions/channels.js');
const { infoMsg } = require('../../functions/message.js');
const { usrNameRegex } = require('../../functions/helpers.js');
const { stripIndents } = require('common-tags');
const talkedRecently = new Set();

module.exports = {
    name: 'destek',
    category: 'ticket',
    description: 'Size özel mesaj kanalı oluşturur.',
	prefix: true,
	owner: false,
	supportserver: false,
	permissions: ['VIEW_CHANNEL'],
    run: async (client, message, args) => {
		let msgAuthor = (await usrNameRegex(message.author.username)).toLowerCase();
		let botChannelId = await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'botkomut'`);
		let botChannel = await getChannel(message, 'id', botChannelId.value);
		let supportRoleId = await querySelect(`SELECT value FROM discord_settings WHERE guild = '${message.guild.id}' AND setting = 'destekrol'`);

		if (!args.length) {
			//if (!botChannel) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, herhangi bir komut kanalı ayarlanmamış.`, true);
			if (botChannel && message.channel.id != botChannel.id) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, bu komutu sadece <#${botChannel.id}> kanalında çalıştırabilirsin.`, true, 10000);
			if (message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`)) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, zaten senin için oluşturulmuş bir destek kanalın var.`, true, 10000);	

			if (talkedRecently.has(message.guild.id + message.author.id)) {
				infoMsg(message, 'FFE26A', `<@${message.author.id}>, yeni bir destek talebi oluşturmak için **5 dakika** beklemelisin.`, true, 10000);
			} else {
				await message.guild.channels.create(`🎫${msgAuthor}`, {
					type: 'text', 
					permissionOverwrites: [
						{
							id: message.author.id,
							allow: ['VIEW_CHANNEL', 'ATTACH_FILES']
						},
						{
							id: message.guild.roles.everyone,
							deny: ['VIEW_CHANNEL']
						}
					],
					reason: `${message.author.username} için destek kanalı oluşturuldu.`
				}).then(c => {
					let mutedUsr = message.guild.roles.cache.find(r => r.name === "Susturulmuş");
					if (mutedUsr) c.createOverwrite(mutedUsr, { SEND_MESSAGES: false });

					if (supportRoleId) {
						let supportRole = message.guild.roles.cache.find(r => r.id === supportRoleId.value);
						c.createOverwrite(supportRole, { VIEW_CHANNEL: true, ATTACH_FILES: true });
					}

					//> Bilgi verilmediğinde kanal otomatik olarak **1 saat sonra** silinir.
					//> Kanal **6 saat inaktif** kaldığında otomatik olarak silinir.
					var embed = new MessageEmbed()
						.setColor('#7FFCFF')
						.setAuthor(`${message.author.username}, destek kanalın oluşturuldu.`, message.author.avatarURL)
						.addField('**Bilgilendirme Bölümü**', stripIndents`
								> Bu mesaj kanalında sorununuzla ilgili bilgi vermelisiniz.
								> Sorununuz çözüldüğü zaman **-kapat** yazarak destek kanalını kapatınız.`, false)
						.addField('**Destek Komutları**',
								   stripIndents`**${process.env.prefix}destek ekle** _@keyubu.com_
								   				**${process.env.prefix}destek çıkar** _@keyubu.com_
												**${process.env.prefix}destek kapat**`, true)
						.addField('**Açıklama**',
								   stripIndents`Destek kanalına bir kişiyi ekler.
								   				Destek kanalından bir kişiyi çıkarır.
												Destek kanalını kapatır.`, true)
					c.send(embed);

					if (message.guild.id === process.env.supportserver) {
						infoMsg(c, 'FFE26A', stripIndents`Yetkilileri etiketlemeniz durumunda **susturma cezası** alabilirsiniz.
													**Çok acil olmayan** durumlarda etiket atmayınız.
													Örneğin sunucunuz biri tarafından ele geçirilmediyse gibi.
													
													Discord üzerinden verilecek destek **basit** düzeydedir.
													Hizmete herhangi bir **müdahale edilecek durum bulunuyorsa** site üzerinden
													destek talebi açmalısınız. Kısa yol: **musteri.keyubu.com/destek-talebi**`);
					} else { 
						infoMsg(c, 'FFE26A', stripIndents`Yetkilileri etiketlemeniz durumunda **susturma cezası** alabilirsiniz.
													**Çok acil olmayan** durumlarda etiket atmayınız.`);
					}
				});
				infoMsg(message, '7FFCFF', stripIndents`<@${message.author.id}>, **destek talebin oluşturuldu:**
														
														Senin adına en üst metin kanalında destek kanalı oluşturuldu.
														Kanalı açıp sorunu bizimle paylaşabilirsin.
														
														Kanala gitmek için bağlantıya tıklayabilirsin: <#${(await getChannel(message, 'name', "🎫" + msgAuthor)).id}>
														
														**Destek Komutları**
														${process.env.prefix}destek ekle _@keyubu.com_
														${process.env.prefix}destek çıkar _@keyubu.com_
														${process.env.prefix}destek kapat`, true);
				
				talkedRecently.add(message.guild.id + message.author.id);
				setTimeout(() => {
					talkedRecently.delete(message.guild.id + message.author.id);
				}, 300000);
			}
		} else if (args[0] === 'ekle') {
			if (message.member.roles.cache.find(r => r.id === supportRoleId.value)) {
				supCha = message.guild.channels.cache.find(c => c.name === `🎫${args[1]}`);
				if (!supCha) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, destek talebi bulunamadı.`, true, 10000);
				else if (args[2] && message.mentions.users.size >= 1) {
					message.mentions.users.map(user => {
						if (user.id === message.author.id) return;
						if (!supCha.members.cache.find(m => m.id === user.id)) {
							supCha.createOverwrite(user, { VIEW_CHANNEL: true, ATTACH_FILES: true })
							infoMsg(message, '65ed3b', '`' + user.username + '`, destek talebine eklendi.', true, 10000);
						} else {
							infoMsg(message, 'FFE26A', '`' + user.username + '`, destek talebine zaten eklenmiş.', true, 10000)
						}
					});
				} else {
					infoMsg(message, 'FFE26A', `<@${message.author.id}>, destek talebine bir kişiyi eklemek için etiketlemelisin.`, true, 10000);
				}
			}
			else if (message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`) === null) { return }
			else {
				supCha = message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`);

				if (args[1] && message.mentions.users.size >= 1) {
					message.mentions.users.map(user => {
						if (user.id === message.author.id) return;
						if (!supCha.members.find(m => m.id === user.id)) {
							supCha.createOverwrite(user, { VIEW_CHANNEL: true, ATTACH_FILES: true })
							infoMsg(message, '65ed3b', '`' + user.username + '`, `' + supCha.name + '` adlı destek talebine eklendi.', true, 10000);
						} else {
							infoMsg(message, 'FFE26A', '`' + user.username + '`, destek talebine zaten eklenmiş.', true, 10000)
						}
					});
				} else {
					infoMsg(message, 'FFE26A', `<@${message.author.id}>, destek talebine bir kişiyi eklemek için etiketlemelisin.`, true, 10000);
				}
			}
		} else if (args[0] === 'çıkar') {
			if (message.member.roles.cache.find(r => r.id === supportRoleId.value)) {
				supCha = message.guild.channels.cache.find(c => c.name === `🎫${args[1]}`);
				if (!supCha) return infoMsg(message, 'FFE26A', `<@${message.author.id}>, destek talebi bulunamadı.`, true, 10000);
				else if (args[2] && message.mentions.users.size >= 1) {
					message.mentions.users.map(user => {
						if (user.id === message.author.id) return;
						if (supCha.members.find(m => m.id === user.id)) {
							supCha.createOverwrite(user, { VIEW_CHANNEL: false, ATTACH_FILES: false })
							infoMsg(message, '65ed3b', '`' + user.username + '`, `' + supCha.name + '` adlı destek talebinden çıkarıldı.', true, 10000);
						} else {
							infoMsg(message, 'FFE26A', '`' + user.username + '`, destek talebinden zaten çıkarılmış.', true, 10000)
						}
					});
				} else {
					infoMsg(message, 'FFE26A', `<@${message.author.id}>, destek talebine bir kişiyi eklemek için etiketlemelisin.`, true, 10000);
				}
			}
			else if (message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`) === null) { return }
			else {
				supCha = message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`);

				if (args[1] && message.mentions.users.size >= 1) {
					message.mentions.users.map(user => {
						if (user.id === message.author.id) return;
						if (supCha.members.find(m => m.id === user.id)) {
							supCha.createOverwrite(user, { VIEW_CHANNEL: false, ATTACH_FILES: false })
							infoMsg(message, '65ed3b', '`' + user.username + '`, destek talebinden çıkarıldı.', true, 10000);
						} else {
							infoMsg(message, 'FFE26A', '`' + user.username + '`, destek talebinden zaten çıkarılmış.', true, 10000)
						}
					});
				} else {
					infoMsg(message, 'FFE26A', `<@${message.author.id}>, destek talebine bir kişiyi eklemek için etiketlemelisin.`, true, 10000);
				}
			}
		} else if (args[0] === 'kapat') {
			if (message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`) === null) return;
			if (message.channel.id != message.guild.channels.cache.find(c => c.name === `🎫${msgAuthor}`).id)
				return infoMsg(message, 'FFE26A', `Bu komutu sadece <#${(await getChannel(message, 'name', "🎫" + msgAuthor)).id}> kanalında kullanabilirsin.`, true, 10000);


			var deleteEmbed = new MessageEmbed()
				.setColor('#65ed3b')
				.setDescription(`Kanalı silmek istediğine eminsen ✅ emojisine tıkla.\nKanalı silmekten son anda vazgeçtiysen ❌ emojisine tıkla.`)

			message.delete({ timeout: 0, reason: `Otomatik bot işlemi.`})
			message.channel.send(deleteEmbed).then((m) => {
				m.react('✅').then(() => m.react('❌'));

				const filter = (reaction, user) => {
					return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
				};

				m.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
					const reaction = collected.first();
			
					if (reaction.emoji.name === '✅') {
						message.channel.delete();
					} else {
						deleteEmbed = new MessageEmbed()
							.setColor('#FFE26A')
							.setDescription(`Kanalı silme işlemi iptal edildi.`)

						m.edit(deleteEmbed).then((s) => {
							m.reactions.removeAll();
							s.delete({ timeout: 6000, reason: 'Otomatik bot işlemi.' });
						}, 3000);
					}
				}).catch(collected => {
					deleteEmbed = new MessageEmbed()
						.setColor('#FFE26A')
						.setDescription(`Kanalı silme işlemi süresi geçtiği için otomatik iptal edildi.`)

					m.edit(deleteEmbed).then((s) => {
						m.reactions.removeAll();
						s.delete({ timeout: 6000, reason: 'Otomatik bot işlemi.' });
					}, 3000);
				});
			});
		}
    }
}