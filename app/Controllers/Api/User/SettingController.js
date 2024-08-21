const _ = require("lodash")

const RestController = require("../../RestController");
const { SETTING_MAPPING_ENUM } = require("../../../config/enum");

class SettingController extends RestController {

    constructor() {
        super('Setting')
        this.resource = 'Setting';
        this.request; //adonis request obj
        this.response; //adonis response obj
        this.params = {}; // this is used for get parameters from url
    }


    async show({ request, response }) {
        try {
            this.request = request;
            this.response = response;
            const type = this.request.params.type;
            let record = {};

            const type_mapping = SETTING_MAPPING_ENUM[type];
            if (type_mapping) {
                record = await this.modal.getRecordByType(type_mapping);
            }

            this.__is_paginate = false;
            this.resource = 'Setting';
            return await this.sendResponse(
                200,
                "Retreived data successfully.",
                record
            )
        }
        catch (err) {
            console.log(err);
            return this.sendError(
                "Internal server error. Please try again later.",
                {},
                500
            )
        }
    }

}


module.exports = SettingController