module.exports = (sequelize, Sequelize) => {

    const User_Api_Tokens = sequelize.define("user_api_tokens", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
                model: require("./User.js")(sequelize, Sequelize),
                key: 'slug'
            }
        },
        api_token: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        device_type: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        device_token: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        platform_type: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        platform_id: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        type: {
            type: Sequelize.ENUM,
            values: ['ACCESS', 'RESET', 'INVITE'],
            allowNull: false

        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        onDelete: 'cascade',
    });

    return User_Api_Tokens;
}