const fs = require("node:fs");

const file = fs.readFileSync("./config.json");
const json = JSON.parse(file);

module.exports = {
	botId: json["botId"],
	guildId: json["guildId"],
	adminId: json["adminId"],
	uffzRoleId: json["uffzRoleId"],
	cwRoleId: json["cwRoleId"],
	mannschafter1RoleId: json["mannschafter1RoleId"],
	mannschafter2RoleId: json["mannschafter2RoleId"],
	mannschafter3RoleId: json["mannschafter3RoleId"],
	uffzChannelId: json["uffzChannelId"],
	cwChannelId: json["cwChannelId"],
	defaultTime: json["defaultTime"],
};
