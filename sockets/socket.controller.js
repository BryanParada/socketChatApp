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
    socket.emit('receive-msg', chatMessages.last10);

    //Conectarlo a una sala especial
    socket.join( user.id ); //tipos de salas: global, socket.id, user.id

    //limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id);
        io.emit('active-users', chatMessages.usersArr);
    })

    socket.on('send-msg', ({uid, msg}) => { 
        if (uid){
            //mensaje privado
            socket.to( uid ).emit('private-msg',{ from: user.name, msg})
        } else{
            chatMessages.sendMessage(user.uid, user.name, msg);
            io.emit('receive-msg', chatMessages.last10);
        }

       
    })

} 

module.exports = {socketController}