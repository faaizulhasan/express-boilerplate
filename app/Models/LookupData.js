const _ = require("lodash")
const { v4: uuidv4 } = require('uuid');


const RestModel = require("./RestModel");

class LookupData extends RestModel {

    constructor() {
        super("lookup_data")
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
            'title',
        ];
    }



    showColumns() {
        return [
            'slug', 'lookup_slug', 'title', 'createdAt'
        ];
    }



    /**
     * Hook for manipulate data input before add data is execute
     * @param {adonis request object} request
     * @param {payload object} params
     */
    async beforeCreateHook(request, params) {
        params.slug = uuidv4();
        params.lookup_slug = request.params.id;
        params.title = params.title?.trim()
        params.createdAt = new Date()
    }


}

module.exports = LookupData;