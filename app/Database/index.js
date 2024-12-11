const dbConfig = require("../config/db.js");

const ChatAssociation = require("./Associations/Chat");
const LookUpAssociation = require("./Associations/LookUp");
const UserAssociation = require("./Associations/User");
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
db.pages = require("./Page.js")(sequelize, Sequelize);
db.notifications = require("./Notification.js")(sequelize, Sequelize);

/* chat room models */
db.chat_rooms = require('./ChatRooms.js')(sequelize, Sequelize)
db.chat_room_users = require('./ChatRoomUsers.js')(sequelize, Sequelize)
db.chat_messages = require('./ChatMessages.js')(sequelize, Sequelize)
db.chat_message_status = require('./ChatMessageStatus.js')(sequelize, Sequelize)


/* Associations */
UserAssociation(db);
LookUpAssociation(db);
ChatAssociation(db);


module.exports = db;
