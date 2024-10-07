const io = require("socket.io");

const constants = require("./app/config/constants");

const SocketAuthentication = require("./app/Middleware/SocketAuthentication");
const MessageController = require("./app/Controllers/Socket/User/MessageController");
const ChatRoomController = require("./app/Controllers/Socket/User/ChatRoomController");
const ChatRoomUser = require("./app/Models/ChatRoomUser");
const ChatRoomUserController = require("./app/Controllers/Socket/User/ChatRoomUserController");
const ChatListener = require("./app/Listeners/ChatListener");


class Socket {
    constructor(server) {
        this.io = io(server);
        this.io.use(SocketAuthentication.authenticate)
            .on('connection', async (socket) => {
                const user_slug = socket.user.slug
                socket.join('user_' + user_slug)
                const user_rooms = await ChatRoomUser.instance().getUserRooms(user_slug);
                console.log("User Rooms : ", user_rooms)
                for (let i = 0; i < user_rooms.length; i++) {
                    socket.join('room_' + user_rooms[i].chat_room_slug)
                }
                this.connection(socket)
            })

    }
    getIo(){
        return this.io;
    }
    connection(socket) {
        console.log("Connection created");
        ChatListener(socket, this.io);

    }


    static instance(server) {
        return new this(server);
    }
}

module.exports = Socket;