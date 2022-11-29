const {response, request} = require('express');
const { Category } = require('../models');

//obtener categorias - paginado - total - populate
const getCategory = async(req = request, res = response) =>{

    const {limit = 5, from = 0} = req.query;
    //define condicion en query
    const query = {status: true}

    const [total, categories ] = await Promise.all([
        Category.countDocuments(query), //1° promesa
        Category.find(query)
            .skip(Number( from )) 
            .limit(Number( limit ))
            .populate('user', 'name')
      ]);
    
        res.json({ 
            msg: 'get API - Controller Category',
            total,
            categories
     
        });

}

//obtener categoria - populate {}
const getCategoryByID = async(req = request, res = response) =>{
 
    const {id} = req.params; 

    const category = await Category.findById(id)
                               .populate('user', 'name');
    
        res.json({ 
            msg: 'get API - Controller Category Simple', 
            category 
        });

}



const createCategory = async(req, res = response) =>{

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name })

    if (categoryDB) {
        return res.status(400).json({
            msg: `Category ${categoryDB.name} already exists`
        })
    }

    // Generar la data a guardar
    const data = {
        name, 
        user: req.user._id
    }
 
    const category = new Category(data);
    //guardar en db
    await category.save();

    res.status(201).json(category);

}

// actualizarCategoria
const putCategory = async(req, res) => {

    const {id} = req.params;
    const { _id, status, user, ...data } = req.body;  

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const categoryDB = await Category.findByIdAndUpdate( id, data, {new: true} )

    res.json({ 
        msg: 'put API - Controller', 
        categoryDB
    });
}

//borrar categoria - cambiar estado:false
const deleteCategory = async(req, res) => {

    const {id} = req.params;
    console.log(id);

 
    //cambiar estado usuario
    const category = await Category.findByIdAndUpdate(id, {status: false}, {new: true}); 
    //const userAuth = req.user;

    res.json({ 
        msg: 'delete API - Controller (category updated to false)',
        category,
        //uid, 
        //userAuth
    });
  }


module.exports = {
    createCategory,
    getCategory,
    getCategoryByID,
    putCategory,
    deleteCategory
}