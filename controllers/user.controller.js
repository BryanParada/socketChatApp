const { response } = require('express'); //ayuda para ver intellissense de la response
const bcryptjs = require('bcryptjs');

const User = require('../models/user'); 

const userGet = async(req = request, res = response) => {

  //const {q, name = 'optionalName', page = 1,  apikey, limit} = req.query; //req.params

  const {limit = 5, from = 0} = req.query;
  const query = {status: true}

  // const users = await User.find(query)
  //                         .skip(Number(from)) 
  //                         .limit(Number(limit));

  // const total = await User.countDocuments(query);

  //await esperara hasta resolver ambas promesas
  //promise.all ejecutara simultaneamente ambas promesas
  //si una da error, todas daran error
  const [total, users] = await Promise.all([
    User.countDocuments(query), //1° promesa
    User.find(query)
        .skip(Number( from )) 
        .limit(Number( limit ))
  ]);

    res.json({ 
        msg: 'get API - Controller',
        total,
        users

        // q,
        // name,
        // apikey,
        // page,
        // limit
    });
  }

const userPut = async(req, res) => {
    //res.status(500).json({ 

    //http://localhost:8080/api/users/10

    const {id} = req.params;
    const { _id, password, google, email,  ...restOfArguments } = req.body;

    //TODO: validar contra base de datos
    if (password) {
      
       //encriptar password
      const salt = bcryptjs.genSaltSync(); 
      restOfArguments.password = bcryptjs.hashSync(password, salt);

    }

    const userDB = await User.findByIdAndUpdate( id, restOfArguments, {new: true} )

    res.json({ 
        msg: 'put API - Controller', 
        userDB
    });
  }

const userPost = async(req, res) => {
 
    const {name, email, password, role } = req.body; 
    //const {google, ...rest } = req.body; //para muchos elementos mandar rest a new User(rest)
    const user = new User({name, email, password, role});
 
    //encriptar password
    const salt = bcryptjs.genSaltSync(); //10 vueltas por defecto
    user.password = bcryptjs.hashSync(password, salt);

    //Guardar en DB
    await user.save();

    // res.status(201).json({ 
    res.json({ 
        msg: 'post API - Controller',
        user
    });
  }

const userDelete = async(req, res) => {

    const {id} = req.params;
console.log(id);

    //const uid = req.uid;

    //BORRAR UN REGISTRO FISICAMENTE
    //const user = await User.findByIdAndDelete(id);

    //cambiar estado usuario
    const user = await User.findByIdAndUpdate(id, {status: false}, {new: true}); 
    //const userAuth = req.user;

    res.json({ 
        msg: 'delete API - Controller (user deleted)',
        user,
        //uid, 
        //userAuth
    });
  }

const userPatch = (req, res) => {
    res.json({ 
        msg: 'patch API - Controller'
    });
  }


module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}