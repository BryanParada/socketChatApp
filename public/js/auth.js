
const myForm = document.querySelector('form');
        
const url = ( window.location.hostname.includes('localhost'))
        ? 'http://localhost:8080/api/auth/'
        : 'https://restserver-production-eb21.up.railway.app/api/auth/'

myForm.addEventListener('submit', ev =>{
    ev.preventDefault();
    const formData = {};

    for( let el of myForm.elements){
        if( el.name.length > 0) 
            formData[el.name] = el.value 
    }
    //console.log(formData);
    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json'}
    })
    .then( resp => resp.json())
    .then( ({msg, token}) =>{
        // console.log(data);
        if( msg){
            return console.error(msg);
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err)
    })
});

function handleCredentialResponse(response) {

 //GOOGLE TOKEN: ID_TOKEN
 //console.log('ID_TOKEN', response.credential);

 const body = { id_token: response.credential }

 fetch(url + 'google', {
    method: 'POST',
    headers: {
        'Content-Type':'application/json'
    },
    body: JSON.stringify(body)
 })
    .then( resp => resp.json() )
    .then( ({token}) => { 
        //console.log(token);
        localStorage.setItem('token', token);
        window.location = 'chat.html';
     })
    .catch(console.warn );
 
}

const button = document.getElementById('g_id_signout');
 button.onclick = () => {

    console.log(google.accounts.id)
    google.accounts.id.disableAutoSelect()
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        console.log('consent revoked');
        localStorage.clear()
        location.reload()
    });
}