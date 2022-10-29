# Durstpanzer II

Durstpanzer II is a discord-bot for the german WarThunder squadron 🍻Durst🍻.

## General Information

### About the bot

The bot is based on discord.js and runs on version 13.

Durstpanzer II is build to help the sqadron leaders to organize the squadron.

### About the squadron

We are a german WarThunder squadron for people of all ages. We are _not_ a tryhard squadron, although we always try to play squadron-battles for fun.

If you want to join us feel free to meet us on the [discord server](https://discord.gg/ecZR7WxMPt).

## Config

Place your secrets and options into `config.json` like so:

```json
{
    "botId": "<Your bot's id goes here>",
    "guildId": "<Your Server's id goes here>",
    "adminId": "<Your own id goes here>",
    "uffzRoleId": "<The leader's role id goes here. >",
    "cwRoleId": "The member role id goes here>"
}

```


Also, you may change the `clientId` and `guildId` in `deploy-commands.js`:

https://github.com/SAASMEEM/Durst_WT_Bot/blob/2f5be5e2c7ca26a09a49b739355b1e62e79740e0/deploy-commands.js#L19-L20

Then run `node deploy-commands.js` to deploy slash-commands to your server.

> **Warning:**  
> The bot is still littered with magic strings and IDs. Especially the [officer role](https://github.com/SAASMEEM/Durst_WT_Bot#offizier) is still hard coded everywhere.  
> Also, there is a role mentioned by the `clanwar` command, which may be changed:
> 
> https://github.com/SAASMEEM/Durst_WT_Bot/blob/2f5be5e2c7ca26a09a49b739355b1e62e79740e0/commands/tracker/clanwar.js#L89-L91


## Usage

There are 3 permission levels:
* 🍺Mannschafter
* 🍻Offizier
* 🔧Developer

### 🍺Mannschafter

#### Utility

* **avatar:** shows the profile picture of yourself or a selected user
* **info:** shows information about the bot

#### Time-tracking

* **userinfo:** shows the time spent in voice-channels by yourself or a selected user
* **leaderboard:** lists all users sorted by their time-scores
* **leaderboard2:** this is a weekly leaderboard for the time-scores
* **username:** you can change your username shown in the leaderboards

### 🍻Offizier

Offizier can use all the commands above and:

* **block:** block a user from the time-tracking and leaderboard, their time gets deleted
* **unblock:** unblock the user from the time-tracking and leaderboard, their time does __not__ get restored
* **clanwar:** you can call a squadron-battle, which posts a chart to entry yourself and get notified at the start time

### 🔧Developer only Commands

* **status:** the developer can change the status shown by the bot like `Playing WarThunder`

## Additional Information

You can contact me on discord: `테일러#8090`

Special thanks to
* [angi-mint](https://github.com/angi-mint)
* [TimTechDev](https://github.com/TimTechDev)

for helping me develop the bot!
