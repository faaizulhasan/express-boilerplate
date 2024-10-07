
module.exports = (sequelize, Sequelize) => {

    const ChatRooms = sequelize.define("chat_rooms", {
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
        title: {
            type: Sequelize.STRING(150),
            allowNull: false,
        },
        image_url: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        description: {
            type: Sequelize.STRING(300),
            allowNull: true,
        },
        type: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING(30),
            allowNull: true,
        },
        member_limit: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1024,
        },
        can_memberEditGroup: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue : true,
        },
        can_memberSendMessage: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue : true,
        },
        can_memberAddMember: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue : true,
        },
        last_message_timestamp: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    });

    return ChatRooms;
}