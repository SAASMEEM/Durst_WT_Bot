import { Events } from "discord.js";

export const name = Events.MessageCreate;
export function execute(message) {
    console.log(message);

}

