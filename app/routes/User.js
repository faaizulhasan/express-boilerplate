const express = require("express")
const router = express.Router();
const multer = require("multer");
const upload = multer()

const checkApiToken = require('../Middleware/CheckApiToken');
const apiAuthentication = require("../Middleware/ApiAuthentication");

const UserOTPController = require("../Controllers/Api/User/UserOTPController");
const OTPTokenAuthentication = require("../Middleware/OTPTokenAuthentication");


const SettingController = require("../Controllers/Api/User/SettingController");
const LookupController = require("../Controllers/Api/User/LookupController");
const UserController = require("../Controllers/Api/User/UserController");
const UserApiTokenController = require("../Controllers/Api/User/UserApiTokenController");





/*----------------------------------   Lookups Routes  ------------------------------*/
router.get('/lookup', (req, res) => (new LookupController()).index({ request: req, response: res }))


/*----------------------------------   Setting Routes  ------------------------------*/
router.get('/setting/:type', checkApiToken, (req, res) => (new SettingController()).show({ request: req, response: res }))


/*----------------------------------   OTP Routes  ------------------------------*/
router.post('/send-otp/mail', checkApiToken, (req, res) => (new UserOTPController()).store({ request: req, response: res }))
router.post('/verify-otp/register', checkApiToken, (req, res) => (new UserOTPController()).verifyOTPRegister({ request: req, response: res }))
router.post('/verify-otp/forgot-password', checkApiToken, (req, res) => (new UserOTPController()).verifyOTPForgotPassword({ request: req, response: res }))


/* User Configure Account Routes */
router.post('/', checkApiToken, upload.any(), (req, res) => (new UserController()).store({ request: req, response: res }))
router.post('/login', checkApiToken, (req, res) => (new UserController()).login({ request: req, response: res }))
router.patch('/device-token', apiAuthentication, (req, res) => (new UserApiTokenController()).update({ request: req, response: res }))
router.post('/social-login', checkApiToken, (req, res) => (new UserController()).socialLogin({ request: req, response: res }))
router.patch('/', apiAuthentication, (req, res) => (new UserController()).update({ request: req, response: res }))
router.patch('/notification', apiAuthentication, (req, res) => (new UserController()).toggleNotification({ request: req, response: res }))
router.get('/', apiAuthentication, (req, res) => (new UserController()).getMyProfile({ request: req, response: res }))
router.post('/forgot-password', checkApiToken, (req, res) => (new UserController()).forgotPassword({ request: req, response: res }))
router.post('/change-password', apiAuthentication, (req, res) => (new UserController()).changePassword({ request: req, response: res }))
router.post('/set-password', OTPTokenAuthentication.authenticate, (req, res) => (new UserController()).setNewPassword({ request: req, response: res }))
router.post('/logout', apiAuthentication, (req, res) => (new UserController()).logout({ request: req, response: res }))
router.delete('/', checkApiToken, apiAuthentication, (req, res) => (new UserController()).destroy({ request: req, response: res }))


module.exports = router;