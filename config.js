const config = require("./config.json");

module.exports = {
    /**
     * Self-explanatory; Your bots secret token.
     */
	BOT_TOKEN: config.token,
    /**
     * URI to a mongo database instance. Usually starts with `mongodb://<your-domain-here>`.
     */
	MONGODB_URI: config.mongoPass,
    /**
     * Admin can use all commands
     */
	ADMIN_ID: config.adminId,
	/**
	 * The client ID (the one of the bot). Used for slash-command deploys.
	 */
	CLIENT_ID: "847868324113416233",
	/**
	 * The guild ID. Used for slash-command deploys.
	 */
	GUILD_ID: "515253143580442660",
	/**
	 * Role which gives access to some more commands.
	 */
	OFFICER_ROLE_ID: "772094019748233218",
	/**
	 * Gets mentioned every time a clanwar is started.
	 */
	CW_ROLE_ID: "872529382034522173",
};
