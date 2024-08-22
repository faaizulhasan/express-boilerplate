const jwt = require("jsonwebtoken")
const _ = require("lodash")
const constants = require("../config/constants")
const { API_TOKENS_ENUM } = require("../config/enum")

const RestModel = require("./RestModel")

class UserApiToken extends RestModel {

    constructor() {
        super("user_api_tokens")
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
            'user_id', 'device_type', 'device_token', 'platform_type', 'platform_id', 'type'
        ];
    }



    showColumns() {
        return [
            'user_id', 'api_token', 'type', 'createdAt'
        ];
    }

    async beforeCreateHook(request, params) {
        await this.deleteRecord(params.id);
        params.api_token = this.generateApiToken(params.user_id)
        params.device_type = request.body.device_type
        params.device_token = request.body.device_token
        params.platform_type = _.isEmpty(request.body.platform_type) ? 'custom' : request.body.platform_type
        params.platform_id = _.isEmpty(request.body.platform_id) ? null : request.body.platform_id
        params.type = params?.type ? params.type : API_TOKENS_ENUM.ACCESS
        params.createdAt = new Date()

    }

    async afterCreateHook(record, request, params) {
        request.api_token = record.api_token;
        delete request.headers['authorization'];

    }

    generateApiToken(user_id) {
        let jwt_options = {
            algorithm: 'HS256',
            expiresIn: constants.JWT_EXPIRY,
            issuer: constants.CLIENT_ID,
            subject: constants.CLIENT_ID,
            jwtid: user_id
        }
        var token = jwt.sign({ user_id: user_id }, constants.JWT_SECRET, jwt_options);
        return token;
    }

    /**
     * Function To Retreive User Token Record If User is activate / not blocked 
     * @param {String} user_slug 
     * @returns {UserApiToken -> User}
     */
    async getRecordByUserId(user_id) {
        const record = await this.orm.findOne({
            where: {
                type: API_TOKENS_ENUM.ACCESS,
                deletedAt: null,
            },
            include: {
                model: User.instance().getModel(),
                required: true,
                where: {
                    user_id: user_id,
                    is_activated: true,
                    is_blocked: false,
                    deletedAt: null,
                }
            },
            order: [['createdAt', 'desc']]
        })

        return _.isEmpty(record) ? {} : record.toJSON();
    }

    async deleteRecord(id, type = 'ALL') {
        const conditions = {}
        if (type !== 'ALL') {
            conditions.type = type;
        }
        conditions.id = id;

        const query = await this.orm.update({
            deletedAt: new Date()
        }, {
            where: conditions
        })
        return true;

    }
}

module.exports = UserApiToken;

const User = require("./User");

