module.exports = (db) => {
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
}