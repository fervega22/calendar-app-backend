const bcrypt = require('bcryptjs/dist/bcrypt');
const {response} = require('express');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');


const createUser = async (req, res = response) =>{

    const {email, password} = req.body;

    try {
        
        let user = await Usuario.findOne({email});

        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            });
        }

        user = new Usuario(req.body);

        //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

         //Generar nuestro JWT
         const token = await generarJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        });

    }
    
}


const loginUser = async (req, res = response) =>{

    const { email, password } = req.body;    

    try {
                
        const user = await Usuario.findOne({email});

        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario con ese email no existe'
            });
        }
        //confirmnar password
        const validPass = bcrypt.compareSync(password, user.password);

        if(!validPass){
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        //Generar nuestro JWT
        const token = await generarJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        });
    }
   
}

const revalidarToken = async (req, res = response) =>{
    try{
        const uid = req.uid;
        const name = req.name;

        //generar nuevo jwt
        const token = await generarJWT(uid, name);

        res.json({
            ok: true,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte al administrador'
        });
    }

}


module.exports = {
    createUser,
    loginUser,
    revalidarToken
}