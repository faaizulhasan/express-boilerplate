const RestModel = require("./RestModel");
const _ = require("lodash")
const { v4: uuidv4 } = require('uuid');
const PushNotification = require('../Libraries/PushNotification/Index');
const User = require("./User");
const UserApiToken = require("./UserApiToken");
const {Op} = require("sequelize");
const {NOTIFICATION_TYPES, ROLES} = require('../config/enum');

class Notification extends RestModel {
    constructor() {
        super("notifications")
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
            'user_id','type', 'type', 'title', 'message', 'badge', 'mutable_content', 'content_available', 'image_url', 'payload', 'is_read'
        ];
    }


    showColumns() {
        return [
            'id','user_id', 'type', 'title', 'message', 'badge', 'mutable_content', 'content_available', 'image_url', 'payload', 'is_read','createdAt'
        ];
    }

    /**
     * omit fields from update request
     */
    exceptUpdateField() {
        return [];
    }

    async indexQueryHook(query, request, slug = {}) {
        query.where = {
            ...query.where,
            user_id: request.user.id,
        };
    }
    async beforeCreateHook(request, params){
        params.is_read = false;
        if (params.payload){
            params.payload = JSON.stringify(params.payload)
        }
    }
    async afterCreateHook(record, request, params) {
        try {
            const userData = await User.instance().getUserByID(record.user_id);
            if (!userData?.push_notification) return;

            const user = await User.instance().getModel().findOne({
                include: [
                    {
                        model: UserApiToken.instance().getModel(),
                        attributes:['device_type','device_token'],
                        required: true,
                        where:{
                            deletedAt: null,
                            device_token:{
                                [Op.not]: null
                            }
                        },
                        order: [['createdAt', 'DESC']]
                    }
                ],
                where:{
                    push_notification: 1,
                    id: record.user_id,
                    deletedAt: null
                },
                raw: true
            });
            let payload = JSON.parse(record.payload);
            payload.ref_id = payload?.ref_id?.toString() || "";
            if (user?.['user_api_tokens.device_token']){
                let push = await PushNotification.instance().sendPushNotification(
                    user['user_api_tokens.device_token'],
                    {title:record.title,body:record.message},
                    payload
                )
                console.log("push===>", push);
            }
        } catch (err) {
            console.log("Error in sending notification : ", err);
        }
    }
    async markAllRead(request){
        await this.orm.update({
            is_read:1
        },{
            where: {
                user_id: request.user.id
            }
        });
        return true;
    }
    async markSingleRead(request){
        await this.orm.update({
            is_read:1
        },{
            where: {
                user_id: request.user.id,
                id: request.params.id
            }
        });
        return true;
    }
    async getUnreadCount(request){
        const totalQuery = {
            where: {
                deletedAt: null,
                user_id: request.user.id,
                is_read: 0
            },
            distinct: true
        }
        let count = await this.orm.count(totalQuery);
        return count;
    }

    async sendAdminNotification(request) {
        let allUsers = await User.instance().getModel().findAll({
            attributes: ["id", "push_notification"],
            where: {
                deletedAt: null,
                user_type: ROLES.USER
            },
            include: [
                {
                    model: UserApiToken.instance().getModel(),
                    as: "UserApiToken_Slug_Single",
                    attributes: ['device_token'],
                    where: {deletedAt: null},
                    order: [['createdAt', 'DESC']]
                }
            ],
            raw: true,
            nest: true
        });

        if (!allUsers.length) return true;
        let push_notification_tokens = [];
        const notifications = allUsers.map((user) => {
            if (user.push_notification) {
                push_notification_tokens.push(user?.UserApiToken_Slug_Single?.device_token);
            }
            return {
                user_id: user.id,
                type: NOTIFICATION_TYPES.ADMIN_NOTIFICATION,
                title: request?.body?.title,
                message: request?.body?.message,
                payload: JSON.stringify({
                    title: request?.body?.title,
                    message: request?.body?.message
                })
            }
        });
        await this.orm.bulkCreate(notifications, {validate: false});
        if (push_notification_tokens.length > 0) {
            let push = await PushNotification.instance().sendPushNotificationMultiple(push_notification_tokens, {
                title: request?.body?.title,
                body: request?.body?.message
            }, {
                title: request?.body?.title,
                body: request?.body?.message
            })
            console.log("push===>", push);
        }
        return true;
    }
}

module.exports = Notification;




