const express = require("express");
const router = express.Router();

const CheckApiToken = require("../Middleware/CheckApiToken");
const AdminApiAuthentication = require("../Middleware/AdminApiAuthentication");

const UserController = require("../Controllers/Api/Admin/UserController");
const LookupController = require("../Controllers/Api/Admin/LookupController");
const LookupDataController = require("../Controllers/Api/Admin/LookupDataController");

/*----------------------------------   Lookups Routes  ------------------------------*/
router.get('/lookup', AdminApiAuthentication.authenticate, (req, res) => (new LookupController()).index({ request: req, response: res }))
router.post('/lookup/:id', AdminApiAuthentication.authenticate, (req, res) => (new LookupDataController()).store({ request: req, response: res }))

/*----------------------------------   Account Routes  ------------------------------*/
router.post('/login', CheckApiToken, (req, res) => (new UserController()).login({ request: req, response: res }))
router.patch('/', AdminApiAuthentication.authenticate, (req, res) => (new UserController()).update({ request: req, response: res }))
router.post('/forgot-password', CheckApiToken, (req, res) => (new UserController()).forgotPassword({ request: req, response: res }))
router.post('/change-password', AdminApiAuthentication.authenticate, (req, res) => (new UserController()).changePassword({ request: req, response: res }))
router.post('/logout', AdminApiAuthentication.authenticate, (req, res) => (new UserController()).logout({ request: req, response: res }))
router.get('/', AdminApiAuthentication.authenticate, (req, res) => (new UserController()).getMyProfile({ request: req, response: res }))


module.exports = router