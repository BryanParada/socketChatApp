const {Router} = require('express');
const { check } = require('express-validator'); 
const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/upload.controller');

const { validateJWT, validateFields, isAdminRole, validateUploadFile } = require('../middlewares');
const {allowedCollection} = require('../helpers/db-validators')
 
 
const router = Router();

router.post('/', [validateUploadFile], loadFile);

router.put('/:collection/:id', [
    validateUploadFile,
    check('id', 'Id must be a valid MongoID').isMongoId(),
    check('collection').custom( c => allowedCollection( c , ['users','products'])),
    validateFields
], updateImageCloudinary); //updateImage

router.get('/:collection/:id', [
    check('id', 'Id must be a valid MongoID').isMongoId(),
    check('collection').custom( c => allowedCollection( c , ['users','products'])),
    validateFields
], showImage)
 

module.exports = router;