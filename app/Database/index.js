const dbConfig = require("../config/db.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.DIALECT,
    operatorsAliases: 0,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Sequelize.Op;
db.QueryTypes = Sequelize.QueryTypes;


/**Import All Models */
db.user_groups = require("./UserGroups.js")(sequelize, Sequelize);
db.users = require("./User.js")(sequelize, Sequelize);
db.user_api_tokens = require("./UserApiTokens.js")(sequelize, Sequelize);
db.user_otp = require("./UserOTP.js")(sequelize, Sequelize);
db.social_user = require("./SocialUser.js")(sequelize, Sequelize);
db.reset_passwords = require("./ResetPasswords.js")(sequelize, Sequelize);



db.settings = require("./Setting.js")(sequelize, Sequelize);
db.lookups = require("./Lookup.js")(sequelize, Sequelize);
db.lookup_data = require("./LookupData.js")(sequelize, Sequelize);




/**User Api Token Models Relationships Or Assosiaction */
db.users.hasOne(db.user_api_tokens, { foreignKey: "user_id", sourceKey: 'id', as: "UserApiToken_Slug_Single" });
db.users.hasMany(db.user_api_tokens, { foreignKey: "user_id", sourceKey: 'id' });
db.user_api_tokens.belongsTo(db.users, {
    foreignKey: "user_id",
    targetKey: 'id'
}, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
});



/*User Groups Model Relation */
db.user_groups.hasMany(db.users, { foreignKey: "user_type", sourceKey: 'type' });
db.users.belongsTo(db.user_groups, {
    foreignKey: "user_type",
    targetKey: 'type'
}, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
});



/*Lookup Data Model Relation */
db.lookups.hasMany(db.lookup_data, { foreignKey: "lookup_id", sourceKey: 'id', as: "LookupData_LookupSlug" });
db.lookup_data.belongsTo(db.lookups, {
    foreignKey: "lookup_id",
    targetKey: 'id',
    as: "LookupData_LookupSlug"
}, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
});




module.exports = db;
