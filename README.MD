# Durstpanzer II

[![Feature Requests](https://img.shields.io/github/issues/SAASMEEM/Durst_WT_Bot/enhancement?label=Feature%20Requests)](https://github.com/SAASMEEM/Durst_WT_Bot/labels/enhancement)
[![Bugs](https://img.shields.io/github/issues/SAASMEEM/Durst_WT_Bot/bug?label=Bugs&color=critical)](https://github.com/SAASMEEM/Durst_WT_Bot/labels/bug)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Discord](https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord)](https://discord.gg/ecZR7WxMPt)

Durstpanzer II is a discord-bot for the German WarThunder squadron 🍻Durst🍻.

## General Information

### About the bot

The bot is based on discord.js and runs on version 13.
> **Warning:**
> The bot won't work if you use other discord.js versions than 13.
> If you still want to use other versions, you need to migrate your code!

Durstpanzer II is build to help the squadron leaders to organize the squadron.

### About the squadron

We are a German WarThunder squadron for people of all ages. We are _not_ a tryhard squadron, although we always try to play squadron-battles for fun.

If you want to join us feel free to meet us on the [discord server](https://discord.gg/ecZR7WxMPt).

## Config

Place your secrets into `.env` like this:

```env
token=<your-token-goes-here>

```

Place your options into `config.json` like this:

> **Warning**
> The defaultTime has to be in 24h time format!
> Example: "20" -> 20 o'clock

```json
{
    "botId": "<Your-bot's-id-goes-here>",
    "guildId": "<Your-server's-id-goes-here>",
    "adminId": "<Your-own-id-goes-here>",
    "uffzRoleId": "<The-leader's-role-id-goes-here>",
    "cwRoleId": "<The-member-role-id-goes-here>",
    "cwChannelId": "<Your-channel-id-goes-here>",
    "defaultTime": "<Your-default-clanwar-starttime-goes-here>"
}

```

Then run `node deploy-commands.js` to deploy slash-commands to your server.

Afterwards run `node index.js` to start the bot.

## Usage

There are 3 permission levels:

- 🍺Mannschafter
- 🍻Offizier
- 🔧Developer

### 🍺Mannschafter

#### Utility

- **avatar:** shows the profile picture of yourself or a selected user
- **info:** shows information about the bot

### 🍻Offizier

Offizier can use all the commands above and:

- **clanwar:** you can call a squadron-battle, which posts a chart to entry yourself. On the entered time the bot notifies all possible participants

### 🔧Developer only Commands

`There are currently no commands`

## Additional Information

Special thanks to

- [angi-mint](https://github.com/angi-mint)
- [TimTechDev](https://github.com/TimTechDev)

for helping me develop the bot!
