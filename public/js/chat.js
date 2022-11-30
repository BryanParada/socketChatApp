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

    ////OPCION1
    // socket.on('receive-msg', (payload) => {
    //     drawMessages(payload)
    // });
    ////OPCION2  
    socket.on('receive-msg', drawMessages); 
    
     ////OPCION1
    // socket.on('active-users', (payload) => {
    //     console.log(payload); 
    // })
    ////OPCION2  
    socket.on('active-users', drawUsers);

    socket.on('private-msg', () => {
        //TODO:
    });
}

const drawUsers = (users = []) =>{
    console.log(users);
    
    let usersHTML = '';
    users.forEach( ({name, uid}) => {

        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success"> ${name}  </h5>
                    <span class="fs-6 text-muted"> ${uid} </span>
                </p>
            </li>
        
        
        `;
    });

    ulUsers.innerHTML = usersHTML;

}

const drawMessages = (messages = []) =>{
    //console.log(users);
    
    let messagesHTML = '';
    messages.forEach( ({name, message}) => {

        messagesHTML += `
            <li>
                <p>
                    <span class="text-primary"> ${name}  </span>
                    <span> ${message} </span>
                </p>
            </li>
        
        
        `;
    });

    ulMessages.innerHTML = messagesHTML;

}

txtMessage.addEventListener('keyup', ({keyCode}) =>{
    const msg = txtMessage.value;
    const uid = txtUid.value;

    if( keyCode !== 13){return;}
    if( msg.length === 0){return;}

    socket.emit('send-msg', { msg, uid });
    txtMessage.value = "";
    
})

const main = async() => {

    await validate_JWT_LS();

} 

main();

 