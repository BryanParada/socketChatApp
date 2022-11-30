const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8080/api/auth/'
: 'https://restserver-production-eb21.up.railway.app/api/auth/'

let user   = null;
let socket = null;

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
    const socket = io({
        'extraHeaders':{
             'x-token': localStorage.getItem('token')
        }
    });
}

const main = async() => {

    await validate_JWT_LS();

} 

main();

 