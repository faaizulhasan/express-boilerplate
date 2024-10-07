const RestModel = require("./RestModel");
const _ = require("lodash")
const { v4: uuidv4 } = require('uuid');

class ChatMessageStatus extends RestModel {
    constructor() {
        super("chat_message_status")
    }

    softdelete() {
        return true;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    getFields() {
        return [
            'message_slug', 'chat_room_slug',
        ];
    }


    showColumns() {
        return [
            'id', 'slug', 'user_slug', 'message_slug', 'is_sender', 'is_read', 'read_timestamp', 'createdAt',
        ];
    }

    /**
     * omit fields from update request
     */
    exceptUpdateField() {
        return [];
    }

    async createRecord(request, params) {
        let record = [];
        let result = [];
        let user_slug;
        let status_record;
        const room_users = (await ChatRoomUser.instance().getRoomUsers(params.chat_room_slug)).map(item => item.user_slug);

        console.log(room_users)
        if (!_.isEmpty(room_users)) {

            for (let i = 0; i < room_users.length; i++) {
                user_slug = room_users[i];
                status_record = {
                    slug: uuidv4(),
                    user_slug,
                    chat_room_slug: params.chat_room_slug,
                    message_slug: params.message_slug,
                    is_sender: user_slug === request.user.slug,
                    is_read: user_slug === request.user.slug,
                    read_timestamp: user_slug === request.user.slug ? new Date() : null
                }
                record.push(status_record);
            }
            result = await this.orm.bulkCreate(record);
        }

        return result.map(item => item.toJSON())


    }


    async deleteThreadMessages(user_slug, chat_room_slug) {

        const record = await this.orm.update(
            { deletedAt: new Date() },
            {
                where: {
                    user_slug,
                    chat_room_slug
                }
            }
        );

        return true;

    }


    async deleteChatMessage(user_slug, message_slug) {
        await this.orm.update({ deletedAt: new Date() }, {
            where: {
                user_slug: user_slug,
                message_slug: message_slug,
                deletedAt: null
            }
        })
        return true;
    }


}

module.exports = ChatMessageStatus

const ChatRoomUser = require("./ChatRoomUser");
