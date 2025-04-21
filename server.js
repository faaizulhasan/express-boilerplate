const express = require("express");
const http = require('http');
const path = require('path');
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const upload = multer();
const { v4: uuidv4 } = require('uuid');
const process = require('process');

require('dotenv').config();
const app = express();
const { sequelize, user_groups, users,pages } = require("./app/Database/index")

const { testRouter, userRoutes, controllerRoutes, adminRoutes } = require('./app/routes');
const { ROLES, UPLOAD_DIRECTORY_MAPPING, UPLOAD_DIRECTORY} = require("./app/config/enum");
const FileHandler = require("./app/Libraries/FileHandler/FileHandler");
const { getUserDirectory, generateHash } = require("./app/Helper");
const Socket = require("./socket.js");

/**App Setup */
app.use(upload.any());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/templates"));
app.use('/', express.static('uploads'));
//app.use('/' + UPLOAD_DIRECTORY_MAPPING[UPLOAD_DIRECTORY.USER], express.static('upload/' + UPLOAD_DIRECTORY.USER));

// Set Cookie Parser, sessions and flash
app.use(cookieParser('NotSoSecret'));
app.use(session({
    secret: 'something',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});
// Error handling middleware
app.use((err, req, res, next) => {
    if (err) {
        console.log("err:",err)
        res.status(500).send({
            code: 500,
            message: err.message,
            data: {},
        });
    } else {
        next();
    }
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});



/**All Route */

app.use('/test', testRouter)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/web', controllerRoutes)


app.get("/", (req, res) => res.render("welcome"))
app.get("/test-socket", (req, res) => {
    res.render('socket-template');
})

/**Server Starting */
const force = process.argv[2] === '--force'
const alter = process.argv[2] === '--alter';
const httpServer = http.createServer(app)
Socket.instance(httpServer)

httpServer.listen(process.env.BACKEND_PORT, () => {
    console.log("Server is running on PORT : ", process.env.BACKEND_PORT)
    sequelize.sync({ force, alter }).then(async () => {
        console.log("Drop and re-sync db.");

        if (force) {
            await FileHandler.makeDirectory(getUserDirectory());

            const obj = [{
                id: 1,
                title: "Super Admin",
                slug: "super-admin",
                type: ROLES.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                title: "App User",
                slug: "app-user",
                type: ROLES.USER,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            ]
            const record = await user_groups.bulkCreate(obj)
            console.log("User Groups Records Created ! ")


            const admin_data = {
                slug: uuidv4(),
                user_type: ROLES.ADMIN,
                name: "Admin",
                email: "admin@yopmail.com",
                password: generateHash("test@123"),
                device_type: "web",
                device_token: "123123123"
            }

            const admin_record = await users.create(admin_data)
            console.log("Admin Record Created ! ")


            const pages_data = [
                {
                    title: "Privacy Policy",
                    slug: "privacy-policy",
                    content: "Lorem epsum",
                    url: "https://trangotech.com/privacy-policy-terms-of-service/",
                    createdAt: new Date()
                },
                {
                    title: "Terms And Conditions",
                    slug: "terms-conditions",
                    content: "Lorem epsum",
                    url: "https://trangotech.com/privacy-policy-terms-of-service/",
                    createdAt: new Date()
                },
            ]


            await pages.bulkCreate(pages_data);
            console.log("Pages Records Created ! ")

        }

        require("./app/config/validator");
    });

})
