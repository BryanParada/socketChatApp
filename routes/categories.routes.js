const {Router} = require('express');
const { check } = require('express-validator'); 

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { existsCategory } = require('../helpers/db-validators')

const { createCategory,
        getCategory,
        getCategoryByID,
        putCategory,
        deleteCategory } = require('../controllers/categories.controller');

const router = Router();
 
/**
 * {{url}}/api/categories
 */

// obtener todas las categorias - publico
router.get('/', getCategory); 

// obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'Not a Mongo ID').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
], getCategoryByID)

// crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validateFields
], createCategory )

// actualizar registro por id - privado - cualquier con token valido
router.put('/:id', [
    validateJWT,
    check('name', 'Category Name is required').not().isEmpty(),
    check('id').custom( existsCategory ),
    validateFields
], putCategory)

// borrar una categoria - admin
router.delete('/:id',[
    validateJWT,
    isAdminRole,
    check('id', 'Not a Mongo ID').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
], deleteCategory)  

module.exports = router;