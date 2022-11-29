const {Router} = require('express');
const { check } = require('express-validator'); 

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { existsProduct, existsCategory } = require('../helpers/db-validators')

const { getProduct,
        getProductByID,
        postProduct,
        putProduct,
        deleteProduct } = require('../controllers/products.controller');

const router = Router();

// obtener todos los productos - publico
router.get('/', getProduct); 

// obtener una producto por id - publico
router.get('/:id', [
    check('id', 'Not a Mongo ID').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
], getProductByID);

// crear producto - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT, 
    check('name', 'Name is required').not().isEmpty(), 
    check('category','Not a mongo ID').isMongoId(),
    check('category').custom( existsCategory ), 
    validateFields
], postProduct )

// actualizar registro por id - privado - cualquier con token valido
router.put('/:id', [
    validateJWT, 
    //check('category','Not a mongo ID').isMongoId(),
    check('category').custom( existsCategory ), 
    validateFields
], putProduct)

// borrar una producto - admin
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'Not a Mongo ID').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
], deleteProduct)  

module.exports = router;