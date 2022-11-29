const path = require('path');
const fs   = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFile } = require("../helpers");
const { User, Product} = require('../models')

const loadFile = async(req, res = response) => {

    //console.log(req.files);
 
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUp) {
    //   res.status(400).json({ msg: 'No files were uploaded.'});
    //   return;
    // }
  
    try {
      //txt-md
      //const fileName = await uploadFile(req.files, ['txt', 'md'], 'textFiles');
      const fileName = await uploadFile(req.files, undefined, 'imgs');
      res.json({
        fileName
      })
      
    } catch (msg) {
      res.status(400).json({msg});
    }

 
}

const updateImage = async(req, res = response) =>{

  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUp) {
  //   res.status(400).json({ msg: 'No files were uploaded.'});
  //   return;
  // }

  const { id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':
        model = await User.findById( id );
        if (!model) {
          return res.status(400).json({
            msg: `There is no user with the id ${id}`
          });
        }
    break;

    case 'products':
        model = await Product.findById( id );
        if (!model) {
          return res.status(400).json({
            msg: `There is no Product with the id ${id}`
          });
        }
    break;

    default:
        return res.status(500).json({ msg: 'We forgot to validate this!'});

        
  }

  //Limpia imagenes anteriores
  if (model.img) {
    //hay que borrar la imagen del servidor
    const pathImage = path.join(__dirname, '../uploads', collection, model.img);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    } 
  }

  const name = await uploadFile( req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json({
    model
  })

}

const updateImageCloudinary = async(req, res = response) =>{

  // if (!req.files || Object.keys(req.files).length === 0 || !req.files.fileUp) {
  //   res.status(400).json({ msg: 'No files were uploaded.'});
  //   return;
  // }

  const { id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':
        model = await User.findById( id );
        if (!model) {
          return res.status(400).json({
            msg: `There is no user with the id ${id}`
          });
        }
    break;

    case 'products':
        model = await Product.findById( id );
        if (!model) {
          return res.status(400).json({
            msg: `There is no Product with the id ${id}`
          });
        }
    break;

    default:
        return res.status(500).json({ msg: 'We forgot to validate this!'});

        
  }

  //Limpia imagenes anteriores
  if (model.img) {
      const nameArr = model.img.split('/');
      const name    = nameArr[nameArr.length - 1]; // para obtener el ultimo
      const [ public_id ]    = name.split('.');
      cloudinary.uploader.destroy( public_id );
 
  }
 
  const {tempFilePath} = req.files.fileUp
  const {secure_url} = await cloudinary.uploader.upload( tempFilePath );
  model.img = secure_url;

  await model.save();


  res.json( model );

}

const showImage = async(req, res = response) => {

  const { id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':
        model = await User.findById( id );
        if (!model) {
          return res.status(400).json({
            msg: `There is no user with the id ${id}`
          });
        }
    break;

    case 'products':
        model = await Product.findById( id );
        if (!model) {
          return res.status(400).json({
            msg: `There is no Product with the id ${id}`
          });
        }
    break;

    default:
        return res.status(500).json({ msg: 'We forgot to validate this!'});

        
  }
  
  if ( model.img ) {
    return res.redirect(model.img)
  }
  
  // //Limpia imagenes anteriores
  // if (model.img) {
  //   //hay que borrar la imagen del servidor
  //   const pathImage = path.join(__dirname, '../uploads', collection, model.img);
  //   if (fs.existsSync(pathImage)) {
  //       return res.redirect(pathImage)
  //   } 
  // }

  const pathImageDefault = path.join(__dirname, '../assets/no-image.jpg');
  res.sendFile(pathImageDefault); 
 
}


module.exports = {
    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}