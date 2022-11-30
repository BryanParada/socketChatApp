const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");


const socketController = async( socket = new Socket()) => {

    //console.log('Client connected', socket.id);
    const user = await checkJWT( socket.handshake.headers['x-token'] );
    if ( !user ){
        return socket.disconnect();
    }
    
    console.log(user.name, 'is connected');
    

} 

module.exports = {socketController}