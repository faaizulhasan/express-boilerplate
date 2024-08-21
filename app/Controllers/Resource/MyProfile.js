const { getUserImageUrl } = require("../../Helper");
const _ = require("lodash")

class MyProfile {

    static async initResponse(data, request) {
        if (_.isEmpty(data))
            return [];

        this.headers = request.headers;
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
        let api_token = _.isEmpty(this.headers.authorization)
            ? Buffer.from(request.api_token).toString('base64')
            : Buffer.from(request.authorization).toString('base64');

        return {
            "firstname": record.firstname || '',
            "lastname": record.lastname || '',
            "name": record.name || '',
            "slug": record.slug,
            "username": record.username || '',
            "email": record.email,
            "image_url": getUserImageUrl(record.image_url),
            "country": record.country || '',
            "mobile_no": record.mobile_no,
            "api_token": api_token,
            "referral_coins": record.referral_coins || 0,
            "vote_coins": record.vote_coins || 0,
            "earned_coins": parseFloat(record?.earned_coins) || 0,
            "remaining_coins": ((parseFloat(record.earned_coins) || 0) - (parseFloat(record.coins_used) || 0)) || 0,
            "followers": record.followers || 0,
            "followings": record.followings || 0,
            "poll_voted": record.poll_voted || 0,
            "poll_created": record.poll_created || 0,
            "multiplier": parseFloat(record?.multiplier) || 1,
            "max_multiplier": parseFloat(request?.max_multiplier) || 1,
            "is_pushNotification": !!record.is_pushNotification
        }
    }
}

module.exports = MyProfile