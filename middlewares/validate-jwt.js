const { response, request } = require('express');
const jwt = require('jsonwebtoken'); 

const User = require('../models/user'); 

const validateJWT = async(req = request, res = response, next) =>{

    const token = req.header('x-token');

    if ( !token) {
        return res.status(401).json({
            msg: 'There is no token in the header request'
        });
    }

    try {
        // const payload = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); 
        // console.log(payload);
        
         //verifica si el token desde el header es valido
         const {uid} = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); 

         //leer el usuario que corresponde al uid
         const user = await User.findById( uid );

         if (!user) {
            return res.status(401).json({
                msg: 'Token Invalid - user does not exist in DB'
            })
         }

         //Verificar si el uid tiene estado en true
         if (!user.status) {
            return res.status(401).json({
                msg: 'Token Invalid - user with status: false'
            })
         }
          
         req.user = user;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid Token'
        })
        
    }

    
    


}

module.exports = {
    validateJWT
}