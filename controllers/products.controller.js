const {response, request} = require('express');
const { Product } = require('../models');

//obtener productos - paginado - total - populate
const getProduct = async(req = request, res = response) =>{
    
    const {limit = 5, from = 0} = req.query;
    //define condicion en query
    const query = {status: true}

    const [total, products ] = await Promise.all([
        Product.countDocuments(query),  
        Product.find(query)
            .skip(Number( from )) 
            .limit(Number( limit ))
            .populate('user', 'name')
            .populate('category', 'name')
      ]);
    
        res.json({ 
            msg: 'get API - Controller Product',
            total,
            products
     
        });

}

//obtener producto - populate {}
const getProductByID = async(req = request, res = response) =>{ 

    const {id} = req.params; 

    const product = await Product.findById(id)
                               .populate('user', 'name') 
                               .populate('category', 'name');
    
        res.json({ 
            msg: 'get API - Controller Product Simple', 
            product 
        });

}

//crea producto
const postProduct = async(req, res = response) =>{

     const { status, user, ...body} = req.body;
     const name = body.name.toUpperCase();

     const productDB = await Product.findOne({  name  });

     if (productDB) {
        return res.status(400).json({
            msg: `Product ${productDB.name} already exists`
        })
    }
 
     // Generar la data a guardar
     const data = {
        ...body,
        name, 
        user: req.user._id
    }

    const product = new Product(data);
    //guardar en db
    await product.save();

    res.status(201).json(product);
     

}


// actualizarproducto
const putProduct = async(req, res) => {

    const {id} = req.params;
    const { _id, status, user, ...data } = req.body;  

     if( data.name ) {
        data.name  = data.name.toUpperCase();
    }
    data.user = req.user._id;

    const productDB = await Product.findByIdAndUpdate( id, data, {new: true} )

    res.json({ 
        msg: 'put API - Controller', 
        productDB
    });
}

//borrar producto - cambiar estado:false
const deleteProduct = async(req, res) => {

    const {id} = req.params;
    console.log(id);
 
    //cambiar estado 
    const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true}); 
    //const userAuth = req.user;

    res.json({ 
        msg: 'delete API - Controller (product updated to false)',
        product,
        //uid, 
        //userAuth
    });
  }


module.exports = {
    getProduct,
    postProduct,
    getProductByID,
    putProduct,
    deleteProduct
}