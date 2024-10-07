const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.DIALECT,
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Sequelize.Op;
db.QueryTypes = Sequelize.QueryTypes;


/**Import All Models */
db.user_groups = require("./UserGroups.js")(sequelize, Sequelize);
db.users = require("./User.js")(sequelize, Sequelize);
db.user_api_tokens = require("./UserApiTokens.js")(sequelize, Sequelize);
db.user_otp = require("./UserOTP.js")(sequelize, Sequelize);
db.social_user = require("./SocialUser.js")(sequelize, Sequelize);
db.reset_passwords = require("./ResetPasswords.js")(sequelize, Sequelize);

db.settings = require("./Setting.js")(sequelize, Sequelize);
db.lookups = require("./Lookup.js")(sequelize, Sequelize);
db.lookup_data = require("./LookupData.js")(sequelize, Sequelize);

/* chat room models */
db.chat_rooms = require('./ChatRooms.js')(sequelize, Sequelize)
db.chat_room_users = require('./ChatRoomUsers.js')(sequelize, Sequelize)
db.chat_messages = require('./ChatMessages.js')(sequelize, Sequelize)
db.chat_message_status = require('./ChatMessageStatus.js')(sequelize, Sequelize)



/**User Api Token Models Relationships Or Assosiaction */
db.users.hasOne(db.user_api_tokens, { foreignKey: "user_id", sourceKey: 'id', as: "UserApiToken_Slug_Single" });
db.users.hasMany(db.user_api_tokens, { foreignKey: "user_id", sourceKey: 'id' });
db.user_api_tokens.belongsTo(db.users, {
    foreignKey: "user_id",
    targetKey: 'id'
}, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
});



/*User Groups Model Relation */
db.user_groups.hasMany(db.users, { foreignKey: "user_type", sourceKey: 'type' });
db.users.belongsTo(db.user_groups, {
    foreignKey: "user_type",
    targetKey: 'type'
}, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
});



/*Lookup Data Model Relation */
db.lookups.hasMany(db.lookup_data, { foreignKey: "lookup_id", sourceKey: 'id', as: "LookupData_LookupSlug" });
db.lookup_data.belongsTo(db.lookups, {
    foreignKey: "lookup_id",
    targetKey: 'id',
    as: "LookupData_LookupSlug"
}, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
});

/* Chat Relations */
/*Chat Rooms Relation */
db.users.hasMany(db.chat_rooms, { foreignKey: "user_slug", sourceKey: 'slug', as: 'ChatRoom_UserSlug' });
db.chat_rooms.belongsTo(db.users, {
    foreignKey: "user_slug",
    targetKey: 'slug',
    as: 'ChatRoom_UserSlug'
});

/*Chat Rooms User Relation */
db.users.hasMany(db.chat_room_users, { foreignKey: "user_slug", sourceKey: 'slug', as: 'ChatRoomUser_UserSlug' });
db.chat_room_users.belongsTo(db.users, {
    foreignKey: "user_slug",
    targetKey: 'slug',
    as: 'ChatRoomUser_UserSlug'
});

db.chat_rooms.hasMany(db.chat_room_users, { foreignKey: "chat_room_slug", sourceKey: 'slug', as: 'ChatRoomUser_ChatRoomSlug' });
db.chat_room_users.belongsTo(db.chat_rooms, {
    foreignKey: "chat_room_slug",
    targetKey: 'slug',
    as: 'ChatRoomUser_ChatRoomSlug'
});

db.chat_room_users.hasMany(db.chat_room_users, {
    foreignKey: "chat_room_slug",
    sourceKey: 'chat_room_slug',
    as: 'ChatRoomUser_ChatRoomSlug_Self'
});

db.chat_room_users.hasOne(db.chat_room_users, {
    foreignKey: "chat_room_slug",
    sourceKey: 'chat_room_slug',
    as: 'ChatRoomUser_ChatRoomSlug_Self_Single'
});


/*Chat Message Relation */
db.users.hasMany(db.chat_messages, { foreignKey: "user_slug", sourceKey: 'slug', as: 'ChatMessage_UserSlug' });
db.chat_messages.belongsTo(db.users, {
    foreignKey: "user_slug",
    targetKey: 'slug',
    as: 'ChatMessage_UserSlug'
});

db.chat_rooms.hasOne(db.chat_messages, { foreignKey: "chat_room_slug", sourceKey: 'slug', as: 'ChatMessage_ChatRoomSlug_Single' });
db.chat_rooms.hasMany(db.chat_messages, { foreignKey: "chat_room_slug", sourceKey: 'slug', as: 'ChatMessage_ChatRoomSlug' });
db.chat_messages.belongsTo(db.chat_rooms, {
    foreignKey: "chat_room_slug",
    targetKey: 'slug',
    as: 'ChatMessage_ChatRoomSlug'
});

db.chat_messages.belongsTo(db.chat_messages, {
    foreignKey: "reply_message_slug",
    targetKey: 'slug',
    as: 'ChatMessage_ChatMessageSlug'
});

/*Chat Message Status Relation */
db.users.hasMany(db.chat_message_status, { foreignKey: "user_slug", sourceKey: 'slug', as: 'ChatMessageStatus_UserSlug' });
db.chat_message_status.belongsTo(db.users, {
    foreignKey: "user_slug",
    targetKey: 'slug',
    as: 'ChatMessageStatus_UserSlug'
});

db.chat_rooms.hasMany(db.chat_message_status, { foreignKey: "chat_room_slug", sourceKey: 'slug', as: 'ChatMessageStatus_ChatRoomSlug' });
db.chat_message_status.belongsTo(db.chat_rooms, {
    foreignKey: "chat_room_slug",
    targetKey: 'slug',
    as: 'ChatMessageStatus_ChatRoomSlug'
});

db.chat_messages.hasOne(db.chat_message_status, { foreignKey: "message_slug", sourceKey: 'slug', as: 'ChatMessageStatus_ChatMessageSlug_Single' });
db.chat_messages.hasMany(db.chat_message_status, { foreignKey: "message_slug", sourceKey: 'slug', as: 'ChatMessageStatus_ChatMessageSlug' });
db.chat_message_status.belongsTo(db.chat_messages, {
    foreignKey: "message_slug",
    targetKey: 'slug',
    as: 'ChatMessageStatus_ChatMessageSlug'
});


module.exports = db;
