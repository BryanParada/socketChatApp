const { response, json } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-JWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req,res = response) =>{

    const {email, password} = req.body;

    try {

        //verficiar si el email existe
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                msg: 'User/Password incorrect - status: false'
            })
        }
  
        // si el usuario esta activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'User/Password incorrect - status: false'
            })
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User/Password incorrect - Password'
            })
        }

        //generar el JWT
        const token = await generateJWT( user.id );
 
        res.json({
            msg: 'Login ok',
            user,
            token
        })
     
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Contact the admin!'
        })
    }

 
}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body;

    try {

        const {name, img, email} = await googleVerify( id_token );
        
        let user = await User.findOne( {email}); 
        
        if (!user) {
              
            //crearlo
            const data = {
                name,
                email,
                password: ':P', 
                img, 
                google: true
            };

            user = new User( data );
            await user.save();
        }

        // Si el usuario en DB esta en false voy a negar su autenticacion en mi app
        if ( !user.status){
            return res.status(401).json({
                msg: 'Contact the admin, user is blocked'
            })
        }

        //generar el JWT
        const token = await generateJWT(user.id);
        
        res.json({
            msg: 'All OK!',
            id_token,
            user,
            token
        })

    } catch (error) {
        res.status(400).json({ 
            msg: 'Token could not be verified'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}