const { response } = require("express");
const Evento = require("../models/Evento");


const getEvents = async(req, res = response) => {

    try {
       const eventos = await Evento.find()
                              .populate('user', 'name');
        
        res.status(201).json({
            ok: true,
            eventos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

 
}

const createEvent = async(req, res = response) => {

    const event = new Evento(req.body);

    try {
        
        event.user = req.uid;

        const eventoGuardado = await event.save();

        res.json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Evento.findById(eventId);

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el registro con ese ID'
            })
        }

        if(event.user.toString() !== uid){
            return res.
            status(401).

            json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }
        
        const nuevoEvento  = {
            ...req.body,
            user: uid
        }

        const eventActualizado = await Evento.findByIdAndUpdate( eventId, nuevoEvento, {new: true} );

        res.        
        json({
            ok: true,
            msg: 'evento actualizado',
            evento: eventActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

   
}

const deleteEvent = async(req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Evento.findById(eventId);

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el registro con ese ID'
            })
        }

        if(event.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete( eventId );

        res.json({
            ok: true,
            msg: 'evento eliminado'
        })
        
    } catch (error) {
        
    }

}

module.exports = {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
}