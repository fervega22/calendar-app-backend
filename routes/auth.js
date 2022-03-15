/*
    Rutas de usuarios / Auth
    host + /api/auth
*/

const {Router} = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Endpoint para crear nuevos usuarios
router.post(
    '/new',
    [
        //middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    createUser);

//Endpoint para loguear usuarios ya existentes
router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),        
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 5 }),
        validarCampos
    ],
    loginUser);

//Endpoint para revalidar el token
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;