
module.exports = (sequelize, Sequelize) => {

    const ChatMessageStatus = sequelize.define("chat_message_status", {
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
        message_slug: {
            type: Sequelize.STRING(100),
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
            references: {
                model: require("./ChatMessages.js")(sequelize, Sequelize),
                key: 'slug'
            }
        },
        is_sender: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        is_read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
        read_timestamp: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return ChatMessageStatus;
}