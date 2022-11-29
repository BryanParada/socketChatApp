const {Router} = require('express');
const { check } = require('express-validator');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');
const { validateFields, validateJWT, isAdminRole, hasRole} = require('../middlewares');

const { isValidRole, emailExists, userExistsById } = require('../helpers/db-validators');

const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user.controller');


const router = Router();


  router.get('/', userGet);

  router.put('/:id', [
    //check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom( isValidRole ),
    validateFields
  ], userPut );

  

  router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    //check('email', 'Email is not valid').isEmail(),
    check('email').custom( emailExists ),
    //check('role', 'Not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom( isValidRole ),
    validateFields
  ], userPost);

  router.delete('/:id', [
    validateJWT,
    //isAdminRole,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'Not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
  ], userDelete);

  router.patch('/', userPatch);




module.exports = router;