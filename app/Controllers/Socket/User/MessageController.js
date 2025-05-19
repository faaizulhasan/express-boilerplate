const { extractFields, getImageUrl, validateAll } = require("../../../Helper");
const ChatMessageStatus = require("../../../Models/ChatMessageStatus");
const ChatRoom = require("../../../Models/ChatRoom");
const ChatRoomUser = require("../../../Models/ChatRoomUser");
const Post = require("../../../Models/Post");
const { POST_TYPE } = require("../../../config/constants");
const {
    CHAT_ROOM_TYPE_ENUM,
    MESSAGE_TYPE_ENUM,
    CHAT_MESSAGE_INSTANCE_TYPE,
} = require("../../../config/enum");
const SocketRestController = require("../../SocketRestController");
const _ = require("lodash");

class MessageController extends SocketRestController {
    constructor() {
        super("ChatMessages");
        this.resource = "ChatMessages";
        this.io; // io obj
        this.socket; // request obj
        this.params = {}; // this is used for get parameters from url
        this.emitter = [];
    }

    async validation(action, id = 0) {
        let validator = [];
        let rules;

        switch (action) {
            case "store":
                rules = {
                    chat_room_id: "required_without:target_user_id",
                    target_user_id: "required_without:chat_room_id",
                    message_type: `required|in:${MESSAGE_TYPE_ENUM.TEXT},${MESSAGE_TYPE_ENUM.FILE}`,
                    message: `required_if:message_type,${MESSAGE_TYPE_ENUM.TEXT}`,
                    file_type: `max:15|required_if:message_type,${MESSAGE_TYPE_ENUM.FILE}`,
                    file_name: `required_if:message_type,${MESSAGE_TYPE_ENUM.FILE}`,
                    file_url: `required_if:message_type,${MESSAGE_TYPE_ENUM.FILE}`,
                    instance_type: `in:${CHAT_MESSAGE_INSTANCE_TYPE.STORIES}`,
                    instance_id: "required_with:instance_type"
                };
                validator = await validateAll(this.socket.body, rules);
                break;
        }
        return validator;
    }

    async beforeStoreLoadModel() {
        let params = this.socket.body;
        let record;

        if (params.chat_room_id) {
            const user_id = this.socket.user.id;
            const chat_room_record = await ChatRoom.instance().getRoomRecordWithUser(
                user_id,
                params.chat_room_id
            );
            if (
                _.isEmpty(chat_room_record) ||
                _.isEmpty(chat_room_record.ChatRoomUser_ChatRoomSlug)
            ) {
                this.__is_error = true;
                return this.sendError("Invalid chat room id", {}, 400);
            }

            const user_record = chat_room_record.ChatRoomUser_ChatRoomSlug[0];
            if (chat_room_record.type === CHAT_ROOM_TYPE_ENUM.SINGLE) return;
            if (user_record.is_leaved || user_record.is_kicked) {
                this.__is_error = true;
                return this.sendError(
                    "You are already removed from this group.",
                    {},
                    400
                );
            }

            if (chat_room_record.can_memberSendMessage) return;
            if (!user_record.is_owner && !user_record.is_subAdmin) {
                this.__is_error = true;
                return this.sendError("Only admin are able to send message ", {}, 400);
            }
        } else {
            if (params.instance_type === CHAT_MESSAGE_INSTANCE_TYPE.STORIES) {
                const record = await Post.instance().getRecordByCondition(this.socket, { id: params.instance_id, type: POST_TYPE.MEMORIES });
                if (_.isEmpty(record)) {
                    params.instance_type = null;
                    params.instance_id = null;
                }
            }
            record = await ChatRoomUser.instance().findRoomAgainstUsers(
                this.socket.user.id,
                params.target_user_id
            );
            if (_.isEmpty(record)) {
                record = await ChatRoom.instance().createRecord(
                    this.socket,
                    extractFields(params, ChatRoom.instance().getFields())
                );
                this.socket.body.is_newRoomMessage = true;
                this.socket.body.chat_room_id = record.id;
            } else {
                this.socket.body.chat_room_id = record.chat_room_id;
            }
        }
    }

    async afterStoreLoadModel(record) {
        this.socket.body.message_id = record.id;
        await ChatMessageStatus.instance().createRecord(
            this.socket,
            extractFields(this.socket.body, ChatMessageStatus.instance().getFields())
        );
        await ChatRoomUser.instance().incrementMessageCount(
            this.socket,
            record.chat_room_id
        );

        if (this.socket.body.is_newRoomMessage) {
            this.resource = "ChatMessages";
            this.emitter.push((obj) =>
                this.io
                    .in("user_" + this.socket.body.target_user_id)
                    .emit("newThread_", obj)
            );
            this.emitter.push((obj) =>
                this.io.in("user_" + this.socket.user.id).emit("newThread_", obj)
            );
        } else {
            this.emitter.push((obj) =>
                this.io
                    .in("room_" + this.socket.body.chat_room_id)
                    .emit("receivedMessage_", obj)
            );
        }
        await ChatRoomUser.instance().updateLastMessageTimeStamp(
            record.chat_room_id
        );

        this.__is_paginate = false;
        await this.sendResponse(200, "Message send successfully", record);

        await ChatRoomUser.instance().updateVisibility(
            this.socket.user.id,
            this.socket.body.chat_room_id
        );
        return;
    }

    async sendMessage({ io, socket }) {
        this.io = io;
        this.socket = socket;

        this.__is_paginate = false;
        this.emitter.push((obj) => this.socket.emit("testing", obj));
        await this.sendResponse(200, "Message Send Successfully", socket.body);
    }

    async loadChatHistory({ io, socket }) {
        this.io = io;
        this.socket = socket;
        this.emitter = [];

        const record = await this.modal.loadChatHistory(socket);

        this.resource = "ChatHistory";
        this.__is_paginate = true;
        this.emitter.push((obj) => this.socket.emit("loadChatHistory_", obj));
        await this.sendResponse(200, "Retrieved data successfully!.", record);

        const chat_room = socket.body.chat_room_id;
        const user_id = socket.user.id;

        await ChatRoomUser.instance().resetMessageCount(chat_room, user_id);
        return;
    }

    async loadChatHistoryBetweenUser({ io, socket }) {
        this.io = io;
        this.socket = socket;
        this.emitter = [];
        let record = [];
        const target_user_id = this.socket.body?.user_id || "";

        if (target_user_id) {
            const chat_room = await ChatRoomUser.instance().findRoomAgainstUsers(
                this.socket.user.id,
                target_user_id
            );
            console.log("Chat Room Data : ", chat_room);

            if (!_.isEmpty(chat_room)) {
                socket.body.chat_room_id = chat_room?.chat_room_id;
                record = await this.modal.loadChatHistory(socket);
            }
        }

        this.resource = "ChatHistory";
        this.__is_paginate = true;
        this.emitter.push((obj) =>
            this.socket.emit("loadChatHistoryBetweenUsers_", obj)
        );
        await this.sendResponse(200, "Retrieved data successfully!.", record);

        const chat_room = socket.body?.chat_room_id || "";
        const user_id = socket.user.id;

        await ChatRoomUser.instance().resetMessageCount(chat_room, user_id);
        return;
    }

    async deleteChatMessage({ io, socket }) {
        this.io = io;
        this.socket = socket;
        const user_id = this.socket.user.id;
        const params = this.socket.body;

        const rules = {
            message_id: "required",
        };
        const validator = await validateAll(params, rules);
        const validation_error = this.validateRequestParams(validator);
        if (this.__is_error) {
            return validation_error;
        }

        const message_record = await this.modal.getRecordBySlug(
            this.socket,
            params.message_id
        );
        if (_.isEmpty(message_record)) {
            return this.sendError("invalid message id", {}, 400);
        }

        if (params.is_fromEveryone) {
            if (message_record.user_id !== user_id) {
                return this.sendError(
                    "Not able to delete this message from everyone",
                    {},
                    400
                );
            }
            await this.modal.deleteRecord(user_id, params.message_id);
            this.emitter.push((obj) =>
                this.io
                    .in("room_" + message_record.chat_room_id)
                    .emit("deleteChatMessage_", obj)
            );
        } else {
            await ChatMessageStatus.instance().deleteChatMessage(
                user_id,
                params.message_id
            );
            this.emitter.push((obj) => this.socket.emit("deleteChatMessage_", obj));
        }

        this.__is_paginate = false;
        await this.sendResponse(200, "Message deleted successfully!.", params);
        return;
    }
}

module.exports = MessageController;
