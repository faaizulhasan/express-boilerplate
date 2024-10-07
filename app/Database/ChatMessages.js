
module.exports = (sequelize, Sequelize) => {

    const ChatMessages = sequelize.define("chat_messages", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        chat_room_slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
            references: {
                model: require("./ChatRooms.js")(sequelize, Sequelize),
                key: 'slug'
            }
        },
        user_slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
            references: {
                model: require("./User.js")(sequelize, Sequelize),
                key: 'slug'
            }
        },
        message_type: {
            type: Sequelize.STRING(30),
            allowNull: false,
        },
        badge_type: {
            type: Sequelize.STRING(30),
            allowNull: true,
        },
        file_type: {
            type: Sequelize.STRING(30),
            allowNull: true,
        },
        message: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        file_name: {
            type: Sequelize.STRING(300),
            allowNull: true,
        },
        file_url: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        file_thumb: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        is_forwarded: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        is_oneTime: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        is_reply: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        reply_message_slug: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        is_disappear: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        disappear_timestamp: {
            type: Sequelize.DATE,
            allowNull: true
        },
        is_anonymous: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return ChatMessages;
}