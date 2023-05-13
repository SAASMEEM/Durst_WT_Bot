import { readFileSync } from "node:fs";

const file = readFileSync("./config.json");
const config = JSON.parse(file);

export const {
	botId,
	guildId,
	adminId,
	uffzRoleId,
	cwRoleId,
	mannschafter1RoleId,
	mannschafter2RoleId,
	mannschafter3RoleId,
	uffzChannelId,
	cwChannelId,
	defaultTime,
} = config;

const requiredKeys = [
	"botId",
	"guildId",
	"adminId",
	"uffzRoleId",
	"cwRoleId",
	"mannschafter1RoleId",
	"mannschafter2RoleId",
	"mannschafter3RoleId",
	"uffzChannelId",
	"cwChannelId",
	"defaultTime",
];

for (const key of requiredKeys) {
	if (!config[key]) {
		throw new Error(`Your config.json is missing the key '${key}'!`);
	}
}
