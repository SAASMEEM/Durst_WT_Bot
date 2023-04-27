const squadron = require("./management/squadron.js");
const clanwar = require("./tracker/clanwar.js");
const avatar = require("./utility/avatar.js");
const info = require("./utility/info.js");

module.exports = {
	commands: [squadron, clanwar, avatar, info],
};
