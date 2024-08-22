const { USER_UPLOAD_DIRECTORY } = require("./constants")

const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
}


const UPLOAD_DIRECTORY = {
    USER: "user",
}

const UPLOAD_DIRECTORY_MAPPING = {
    [UPLOAD_DIRECTORY.USER]: 'user',
}

const LOGIN_TYPE = {
    CUSTOM: "custom",
    GOOGLE: "google",
    APPLE: 'apple',
    FACEBOOK: 'facebook'
}

const API_TOKENS_ENUM = {
    ACCESS: "ACCESS",
    RESET: 'RESET'
}

const OTP_VERIFICATION_TYPE = {
    EMAIL: 'EMAIL',
    MOBILE_NO: 'MOBILE_NO'
}


const SETTING_ENUM = {
    PRIVACY_POLICY: 'PRIVACY_POLICY',
    TERMS_AND_CONDITION: 'TERMS_AND_CONDITION'
}

const SETTING_MAPPING_ENUM = {
    'privacy-policy': SETTING_ENUM.PRIVACY_POLICY,
    'terms-and-condition': SETTING_ENUM.TERMS_AND_CONDITION,
}



module.exports = {
    ROLES,
    LOGIN_TYPE,
    API_TOKENS_ENUM,
    OTP_VERIFICATION_TYPE,
    UPLOAD_DIRECTORY,
    UPLOAD_DIRECTORY_MAPPING,
    SETTING_ENUM,
    SETTING_MAPPING_ENUM,

}