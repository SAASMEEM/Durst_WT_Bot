import { readFileSync } from "node:fs";

const file = readFileSync("./config.json");
const json = JSON.parse(file);

export const botId = json["botId"];
export const guildId = json["guildId"];
export const adminId = json["adminId"];
export const uffzRoleId = json["uffzRoleId"];
export const cwRoleId = json["cwRoleId"];
export const mannschafter1RoleId = json["mannschafter1RoleId"];
export const mannschafter2RoleId = json["mannschafter2RoleId"];
export const mannschafter3RoleId = json["mannschafter3RoleId"];
export const uffzChannelId = json["uffzChannelId"];
export const cwChannelId = json["cwChannelId"];
export const defaultTime = json["defaultTime"];
