# Discord Bot
Discord bot still in development.

- [English Description](https://github.com/sametgirginer/discordjs-bot/blob/master/README.md)
- [Turkish Description](https://github.com/sametgirginer/discordjs-bot/blob/master/README_TR.md)

# 🏷️ Features

- Organized and easy to read code structure.
- Language support.
- Level/XP/Rank system.
- Music commands.
- Commands to pull data from many sites.
- NSFW detection for images in messages. (DeepAI API)
- MYSQL support.
- Moderation commands.
- It supports both slash commands and prefix commands at the same time.
- Automatic reply to messages. (autoresponse.js function with json)

# 📄 Commands

**💾 Data Commands 💾**

| Name          | Category      | Type              | Description   |
| ------------- | ------------- | ----------------- | ------------- |
| artstation    | Data          | Slash Command     | Retrieves image data from Artstation.com link.  |
| coub          | Data          | Slash Command     | Retrieves video data from Coub.com link. |
| instagram     | Data          | Slash Command     | Retrieves media data from Instagram link. |
| pinterest     | Data          | Slash Command     | Retrieves video/image data from Pinterest.com link. |
| reddit        | Data          | Slash Command     | Retrieves video data from Reddit.com link. |
| tiktok        | Data          | Slash Command     | Retrieves video data from TikTok.com link. |
| twitter       | Data          | Slash Command     | Retrieves video/gif data from Twitter.com link. |

**🤖 Fun Commands 🤖**

| Name          | Category      | Type              | Description   |
| ------------- | ------------- | ----------------- | ------------- |
| d20           | Fun           | Prefix Command    | You can roll a D20.  |
| kasar         | Fun           | Slash Command     | Canvas command (there is only Turkish description in image). |

**💡 Information Commands 💡**

| Name          | Category      | Type              | Description   |
| ------------- | ------------- | ----------------- | ------------- |
| avatar        | Info          | Prefix Command    | Sends avatar image and link. |
| banner        | Info          | Prefix Command    | Sends banner image and link. |
| emoji         | Info          | Slash Command     | Returns the specified emoji(s). |
| help          | Info          | Prefix Command    | Shows bot commands. (prefix support only) |
| invite        | Info          | Prefix Command    | Send the invite link to add the bot to your server. |
| ping          | Info          | Prefix Command    | Indicates ping delay. |
| serveravatar  | Info          | Prefix Command    | Sends server avatar image and link. |
| stats         | Info          | Prefix Command    | Shows bot status information. |

**🪄 Moderation Commands 🪄**

| Name          | Category      | Type              | Description   |
| ------------- | ------------- | ----------------- | ------------- |
| ban           | Moderation    | Prefix Command    | Bans a user from the server. |
| eval          | Moderation    | Prefix Command    | eval command |
| guilds        | Moderation    | Prefix Command    | Shows which servers the bot is on. |
| kick          | Moderation    | Prefix Command    | Kicks a user from the server. |
| options       | Moderation    | Prefix Command    | Customize bot options. |
| prunexp       | Moderation    | Prefix Command    | Retrieves users with less than xp value you specified. |
| restart       | Moderation    | Prefix Command    | Restarts the bot. |
| scmd          | Moderation    | Prefix Command    | Deletes or updates all slash commands in a guild. |
| unban         | Moderation    | Prefix Command    | Unbans a banned user from the server. |

**🎶 Music Commands 🎶**

| Name          | Category      | Type              | Description   |
| ------------- | ------------- | ----------------- | ------------- |
| leave         | Music         | Prefix Command    | Kicks the bot from the voice channel. |
| loop          | Music         | Prefix Command    | Command to loop music. |
| pause         | Music         | Prefix Command    | Command to pause music. |
| play          | Music         | Prefix Command    | Command to play music. |
| skip          | Music         | Prefix Command    | Command to skip music. |

**✨ Rank (Stats) Commands ✨**

| Name          | Category      | Type              | Description   |
| ------------- | ------------- | ----------------- | ------------- |
| rank          | Stats         | Prefix Command    | Shows the current rank on guild. |
| top           | Stats         | Prefix Command    | Guild level ranking. |

# Installing

1. Rename the **.env.example** file to **.env**
2. Fill in the required variables.
    - `token` & `appid`
    - `ownerid` & `supportserver`
    - `dbhost` & `dbuser` & `dbpassword` & `dbname`
3. Type "**npm install**" on the command line to install the required npm packages.
4. You can start the bot with the command "**node index.js**"

# .env information

- `twitterapptoken` - Optional for Twitter command
- `instagramcookies` - Optional for Instagram command
- `spotifyclientid` & `spotifyclientsecret` - Spotify links for play command
- `deepaikey` - NSFW detection for images in messages.