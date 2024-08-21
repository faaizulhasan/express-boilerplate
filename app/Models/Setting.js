const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const RestModel = require("./RestModel");

class Setting extends RestModel {
  constructor() {
    super("settings");
  }

  getFields() {
    return ["text"];
  }

  showColumns() {
    return ["slug", "type", 'text'];
  }

  exceptUpdateField() {
    return ["slug", "type"];
  }


  async getRecordByType(type) {
    const record = await this.orm.findOne({
      where: {
        type: type,
        deletedAt: null
      },
      orderBy: ["createdAt", "desc"],
    });

    return _.isEmpty(record) ? {} : record.toJSON();
  }


  async beforeCreateHook(request, params) {
    params.slug = uuidv4();
    params.text = params.text?.trim()
    params.createdAt = new Date()
  }

  async beforeEditHook(request, params, slug) {
    let exceptUpdateField = this.exceptUpdateField();
    exceptUpdateField.filter(exceptField => {
      delete params[exceptField];
    });
  }
}

module.exports = Setting;
