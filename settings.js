import { readFileSync } from "node:fs";

const file = readFileSync("./config.json");

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
} = JSON.parse(file);

if (!botId) {
	throw new Error("Your config.json is missing the key 'botId'!");
}

if (!guildId) {
	throw new Error("Your config.json is missing the key 'guildId'!");
}

if (!adminId) {
	throw new Error("Your config.json is missing the key 'adminId'!");
}

if (!uffzRoleId) {
	throw new Error("Your config.json is missing the key 'uffzRoleId'!");
}

if (!cwRoleId) {
	throw new Error("Your config.json is missing the key 'cwRoleId'!");
}

if (!mannschafter1RoleId) {
	throw new Error("Your config.json is missing the key 'mannschafter1RoleId'!");
}

if (!mannschafter2RoleId) {
	throw new Error("Your config.json is missing the key 'mannschafter2RoleId'!");
}

if (!mannschafter3RoleId) {
	throw new Error("Your config.json is missing the key 'mannschafter3RoleId'!");
}

if (!uffzChannelId) {
	throw new Error("Your config.json is missing the key 'uffzChannelId'!");
}

if (!cwChannelId) {
	throw new Error("Your config.json is missing the key 'cwChannelId'!");
}

if (!defaultTime) {
	throw new Error("Your config.json is missing the key 'defaultTime'!");
}
