module.exports = (sequelize, DataTypes) => {
	return sequelize.define('clanwar', {
		messageId: {
			type: DataTypes.INTEGER,
			primaryKey: true,
		},
        ChannelId: {
			type: DataTypes.INTEGER,
		},
		battleRank: {
			type: DataTypes.STRING,
			defaultValue: 0,
			allowNull: true,
		},
        startTime: {
            type: DataTypes.INTEGER,
        },
	}, {
		timestamps: false,
	});
};