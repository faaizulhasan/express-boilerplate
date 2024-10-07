const { baseUrl, getImageUrl } = require("../../Helper");
const _ = require("lodash")

class ChatThreads {

    static async initResponse(data, request) {
        // console.log("Chat Threads Data : ", data?.map(item => item?.ChatMessage_ChatRoomSlug))
        console.log("Chat thread data : ", data)
        if (_.isEmpty(data))
            return Array.isArray(data) ? [] : {};

        let response;
        if (Array.isArray(data)) {
            response = []
            for (var i = 0; i < data.length; i++) {
                response.push(this.jsonSchema(data[i], request));
            }
        } else {
            response = this.jsonSchema(data, request)
        }
        return response;

    }


    static jsonSchema(record, request) {
        const user_record = record.ChatRoomUser_ChatRoomSlug_Self_Single.ChatRoomUser_UserSlug
        const my_record = request.user;

        let message_record = record.ChatRoomUser_ChatRoomSlug.ChatMessage_ChatRoomSlug.length ? record.ChatRoomUser_ChatRoomSlug.ChatMessage_ChatRoomSlug[0] : {}
        const message = {}

        if (!_.isEmpty(message_record)) {
            message.slug = message_record.slug;
            message.message_type = message_record.message_type
            message.badge_type = message_record.badge_type || ''
            message.file_type = message_record.file_type || ''
            message.message = message_record.message
            message.file_name = message_record.file_name
            message.file_url = message_record.file_url
            message.file_thumb = message_record.file_thumb
            message.message_timestamp = message_record.message_timestamp
            message.sender = (message_record.user_slug === my_record.slug) ? 'You' : user_record.name
            message.createdAt = message_record.createdAt
        }

        console.log('Message record : ', record.ChatRoomUser_ChatRoomSlug.ChatMessage_ChatRoomSlug)
        return {
            "chat_room_slug": record.chat_room_slug,
            "user_slug": user_record.slug,
            "image_url": getImageUrl(user_record.image_url),
            "room_name": user_record.name || '',
            "unread_message_count": record.unread_message_count || 0,
            "message": message
        }
    }
}

module.exports = ChatThreads