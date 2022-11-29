const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = ( files, validExtension = ['png', 'jpg','jpeg', 'gif'], folder = '' ) =>{

    return new Promise( (resolve, reject) => {


        const { fileUp } = files; 
        const nameCut = fileUp.name.split('.');
        const extension = nameCut[ nameCut.length - 1];
    
        // Validar extensiones 
        if (!validExtension.includes( extension )) {
            return reject(`Extension ${ extension } is not allowed. Use the next extensions: ${ validExtension }`); 
        }
    
        const tempName = uuidv4() + '.' + extension;
        
        const uploadPath = path.join(__dirname, '../uploads/', folder,  tempName);
        console.log(tempName);
        
        fileUp.mv(uploadPath, (err) => {
          if (err) {
           reject(err);
          }
      
          resolve(tempName);
        });
    




    })


   



}


module.exports = {
    uploadFile
}