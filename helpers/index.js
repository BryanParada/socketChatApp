const dbValidators = require('./db-validators');
const generateJWT  = require('./generate-JWT');
const googleVerify = require('./google-verify');
const uploadFile   = require('./upload-file');


//... esparciran su contenido
module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...uploadFile
}
