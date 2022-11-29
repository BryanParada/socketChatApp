const {Router} = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields} = require('../middlewares');

const {login, googleSignIn, renewToken} = require('../controllers/auth.controller'); 

const router = Router();
 
router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    validateFields
], login );

router.post('/google', [
    check('id_token', 'Google id_token is required').not().isEmpty(), 
    validateFields
], googleSignIn );

router.get('/', validateJWT, renewToken )

module.exports = router;