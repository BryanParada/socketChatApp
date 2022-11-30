const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMessages } = require('../models')

const chatMessages = new ChatMessages();

const socketController = async( socket = new Socket(), io) => {

    //console.log('Client connected', socket.id);
    const user = await checkJWT( socket.handshake.headers['x-token'] );
    if ( !user ){
        return socket.disconnect();
    }
    
    //console.log(user.name, 'is connected');

    //Agregar el usuario conectado
    chatMessages.connectUser( user );
    io.emit('active-users', chatMessages.usersArr);

    //limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id);
        io.emit('active-users', chatMessages.usersArr);
    })

    socket.on('send-msg', ({uid, msg}) => {
        chatMessages.sendMessage(user.uid, user.name, msg);
        io.emit('receive-msg', chatMessages.last10);
    })

} 

module.exports = {socketController}