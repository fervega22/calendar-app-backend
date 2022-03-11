/*
    Rutas de calendar / Events
    host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

//Validar el token de todas las peticiones 
router.use(validarJWT); 

//Get Events
router.get('/', getEvents);

//Create a new event
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de fin es obligatoria').custom(isDate),
        validarCampos
    ],
    createEvent);

//Update a event
router.put('/:id', updateEvent);

//Delete a event
router.delete('/:id', deleteEvent);

module.exports = router;

