const jwt = require('jsonwebtoken');

const generateJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid};

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => { //callback

            if (err) {
                console.log(err);
                reject("Can't generate Token")
            } else{
                resolve( token );
            }

        })


    }) 

}

module.exports = {
    generateJWT
}