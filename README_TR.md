# Discord Bot
Discord botu hala geliştirme aşamasında.

- [İngilizce Açıklama](https://github.com/sametgirginer/discordjs-bot/blob/master/README.md)
- [Türkçe Açıklama](https://github.com/sametgirginer/discordjs-bot/blob/master/README_TR.md)

# 🏷️ Özellikler

- Düzenli ve okunması kolay kod yapısı.
- Dil desteği.
- Seviye/XP/Rütbe sistemi.
- Müzik komutları.
- Birçok siteden veri çekme komutları.
- Mesajlardaki resimler için NSFW algılama. (DeepAI API'si)
- MYSQL desteği.
- Moderasyon komutları.
- Aynı anda hem eğik çizgi (slash) komutlarını hem de önek (prefix) komutlarını destekler.
- Mesajlara otomatik cevap. (autoresponse.js fonksiyonu)

# 📄 Komutlar

**💾 Veri Komutları 💾**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| artstation    | Veri          | Slash Komutu      | Artstation.com bağlantısından resim verilerini alır. |
| coub          | Veri          | Slash Komutu      | Coub.com bağlantısından video verilerini alır. |
| pinterest     | Veri          | Slash Komutu      | Pinterest.com bağlantısından video/resim verilerini alır. |
| reddit        | Veri          | Prefix Komutu     | Reddit.com bağlantısından video verilerini alır. |
| tiktok        | Veri          | Slash Komutu      | TikTok.com bağlantısından video verilerini alır. |
| twitter       | Veri          | Slash Komutu      | Twitter.com bağlantısından video/gif verilerini alır. |

**🤖 Eğlence Komutları 🤖**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| d20           | Eğlence       | Prefix Komutu     | D20 zarı atabilirsiniz. |
| kasar         | Eğlence       | Slash Komutu      | Canvas komutu (resimde sadece Türkçe açıklama vardır). |

**👾 Oyun Komutları 👾**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| chess         | Oyun          | Prefix Komutu     | Discord Etkinleri (discord-together) |
| poker         | Oyun          | Prefix Komutu     | Discord Etkinleri (discord-together) |
| youtube       | Oyun          | Prefix Komutu     | Discord Etkinleri (discord-together) |

**💡 Bilgilendirme Komutları 💡**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| avatar        | Bilgilendirme | Prefix Komutu     | Avatar resmini ve bağlantısını gönderir. |
| banner        | Bilgilendirme | Prefix Komutu     | Banner resmini ve bağlantısını gönderir. |
| emoji         | Bilgilendirme | Slash Komutu      | Belirtilen emojiyi/emojileri döndürür. |
| help          | Bilgilendirme | Prefix Komutu     | Bot komutlarını gösterir. (yalnızca prefix desteği) |
| invite        | Bilgilendirme | Prefix Komutu     | Botu sunucunuza eklemek için davet bağlantısını gönderir. |
| ping          | Bilgilendirme | Prefix Komutu     | Ping gecikmesini gösterir. |
| serveravatar  | Bilgilendirme | Prefix Komutu     | Sunucu avatar resmini ve bağlantısını gönderir. |
| stats         | Bilgilendirme | Prefix Komutu     | Bot durum bilgilerini gösterir. |

**🪄 Moderasyon Komutları 🪄**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| ban           | Moderasyon    | Prefix Komutu     | Bir kullanıcıyı sunucudan yasaklar. |
| eval          | Moderasyon    | Prefix Komutu     | Eval komutu |
| guilds        | Moderasyon    | Prefix Komutu     | Botun hangi sunucularda olduğunu gösterir. |
| kick          | Moderasyon    | Prefix Komutu     | Bir kullanıcıyı sunucudan atar. |
| options       | Moderasyon    | Prefix Komutu     | Bot seçeneklerini özelleştirin. |
| prunexp       | Moderasyon    | Prefix Komutu     | Belirttiğiniz xp değerinden daha düşük olan kullanıcıları getirir. |
| restart       | Moderasyon    | Prefix Komutu     | Botu yeniden başlatır. |
| survey        | Moderasyon    | Prefix Komutu     | Otomatik olarak bir anket hazırlar. |
| tokenban      | Moderasyon    | Prefix Komutu     | Belirli bir kullanıcı davetinden gelen kullanıcıları yasaklar. |
| tokenkick     | Moderasyon    | Prefix Komutu     | Belirli bir kullanıcı davetinden gelen kullanıcıları atar. |
| unban         | Moderasyon    | Prefix Komutu     | Yasaklanan bir kullanıcının sunucudaki yasağını kaldırır. |

**🎶 Müzik Komutları 🎶**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| leave         | Müzik         | Prefix Komutu     | Botu ses kanalından atar. |
| loop          | Müzik         | Prefix Komutu     | Müziği döngüye alma komutu. |
| pause         | Müzik         | Prefix Komutu     | Müziği duraklatma komutu. |
| play          | Müzik         | Prefix Komutu     | Müzik çalma komutu. |
| skip          | Müzik         | Prefix Komutu     | Müziği geçme komutu. |

**✨ Rank (İstatistik) Komutları ✨**

| Ad            | Kategori      | Tip               | Açıklama   |
| ------------- | ------------- | ----------------- | ------------- |
| rank          | İstatistik    | Prefix Komutu     | Sunucudaki mevcut rütbeyi gösterir. |
| top           | İstatistik    | Prefix Komutu     | Sunucunun seviye sıralaması. |

# Kurulum

1. **.env.example** dosyasını **.env** olarak yeniden adlandırın.
2. Gerekli değişkenleri doldurun.
    - `token` & `appid`
    - `ownerid` & `supportserver`
    - `dbhost` & `dbuser` & `dbpassword` & `dbname`
3. Gerekli npm paketlerini kurmak için komut satırına "**npm install**" yazın.
4. Botu "**node index.js**" komutuyla başlatabilirsiniz.

# .env bilgilendirme

- `twitterapptoken` - twitter komutu için opsiyonel
- `spotifyclientid` & `spotifyclientsecret` - play komutu için Spotify bağlantıları
- `deepaikey` - Mesajlardaki resimler için NSFW algılama.