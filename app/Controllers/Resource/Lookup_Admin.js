const _ = require("lodash")

class Lookup {

    static async initResponse(data, request) {
        if (_.isEmpty(data))
            return {};

        let response = {};

        for (var i = 0; i < data.length; i++) {
            const record = data[i];

            response[record.key] = {
                "id": record.id,
                "title": record.title,
                "values": record.LookupData_LookupSlug?.map(item => {
                    return {
                        "slug": item.slug,
                        "title": item.title
                    }
                }) || []
            }
        }

        return response;

    }


}

module.exports = Lookup