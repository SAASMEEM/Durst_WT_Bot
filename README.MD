# Durstpanzer II

[![Feature Requests](https://img.shields.io/github/issues/SAASMEEM/Durst_WT_Bot/enhancement?label=Feature%20Requests)](https://github.com/SAASMEEM/Durst_WT_Bot/labels/enhancement)
[![Bugs](https://img.shields.io/github/issues/SAASMEEM/Durst_WT_Bot/bug?label=Bugs&color=critical)](https://github.com/SAASMEEM/Durst_WT_Bot/labels/bug)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Discord](https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord)](https://discord.gg/KbbXnCKaTY)

Durstpanzer II is a discord-bot for the German WarThunder squadron 🍻Durst🍻.

## General Information

### About the bot

The bot is based on discord.js and runs on version 13.
> **Warning:**
> The bot won't work if you use other major discord.js versions than 13.
> If you still want to use other major versions, you need to migrate your code!

Durstpanzer II is build to help the squadron leaders to organize the squadron.

### About the squadron

We are a German WarThunder squadron for people of all ages. We are _not_ a tryhard squadron, although we always try to play squadron-battles for fun.

If you want to join us feel free to meet us on the [discord server](https://discord.gg/KbbXnCKaTY).

## How to setup the bot

### Config

Place your secrets into `.env` like this:

```env
token=your-token-goes-here

```

Place your options into `config.json` like this:

> **Warning**
> The defaultTime has to be in 24h time format!
> Example: "20" ⇾ 20 o'clock\
> Also make sure to place all info in there, otherwise the bot will crash!

```json
{
    "botId": "Your-bot's-id-goes-here",
    "guildId": "Your-server's-id-goes-here",
    "adminId": "Your-own-id-goes-here",
    "uffzRoleId": "The-leader's-role-id-goes-here",
    "cwRoleId": "The-member-role-id-goes-here",
    "mannschafter1RoleId": "The-first-member-role-id-goes-here",
    "trialRoleId": "The-trial-member-role-id-goes-here",
    "uffzChannelId": "The-leader's-channel-id-goes-here",
    "cwChannelId": "Your-channel-id-goes-here",
    "defaultTime": "Your-default-clanwar-starttime-goes-here"
}

```

### Start the bot

First run `npm ci` to install the dependencies.

Then run `npm run deploy` to deploy slash-commands to your server.

Afterwards run `npm run start` to start the bot.

## Commands

### Squadron Management

- **squadron:** Manage Roles for Users trough this command

### Clanwar

- **clanwar:** you can call a squadron-battle, which posts a chart to entry yourself. On the entered time the bot notifies all possible participants

### Utility

- **avatar:** shows the profile picture of yourself or a selected user
- **info:** shows information about the bot
  
## Additional Information

Special thanks to

- [angi-mint](https://github.com/angi-mint)
- [TimTechDev](https://github.com/TimTechDev)

for helping me develop the bot!
