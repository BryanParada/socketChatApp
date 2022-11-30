const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth/'
: 'https://restserver-production-eb21.up.railway.app/api/auth/'

let user   = null;
let socket = null;

//Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers    = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnExit    = document.querySelector('#btnExit');

// validar el token del localstorage
const validate_JWT_LS = async() =>{
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10){
        window.location = 'index.html';
        throw new Error('There is no token in the server');
    }

    const resp = await fetch( url, {
        headers: {'x-token': token}
    });

    const { user: userDB, token: tokenDB} = await resp.json();
    //console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

   await connectSocket();
}

const connectSocket = async() =>{
    socket = io({
        'extraHeaders':{
             'x-token': localStorage.getItem('token')
        }
    });
    
    socket.on('connect', () =>{
        console.log('Sockets Online') 
    });

    socket.on('disconnect', () =>{
        console.log('Sockets Offline') 
    });

    socket.on('receive-msg', () => {
     //TODO:
    })
    
    socket.on('active-users', () => {
        //TODO:
    });

    socket.on('private-msg', () => {
        //TODO:
    });
}

const main = async() => {

    await validate_JWT_LS();

} 

main();

 