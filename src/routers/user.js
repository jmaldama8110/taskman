const express = require('express')
const router = new express.Router()
const User = require('../model/user')

router.post('/users', async (req, res)=>{

    const user = new User( req.body )

    try{
        await user.save()
        res.status(201).send(user)
    }
    catch (err) {
        res.status(400).send(err)
    }

})

router.get('/users', async (req, res)=>{

    try{
        const lsU = await User.find( {} )
        res.send(lsU)
    }
    catch(err){
        res.status(500).send(err)
    }

})

router.get('/users/:id', async (req, res)=>{

    const _id = req.params.id

    try{
        const usr1 = await User.findById( _id )
        if ( !usr1 ){
            return res.status(404).send()
        }
        res.status(200).send(usr1)
    }
    catch (err){
        res.status(500).send(err)
    }

})

router.patch('/users/:id', async (req, res)=>{

    const actualizaciones = Object.keys( req.body )
    const camposPermitidos = ['name', 'email', 'password', 'age']

    if( !isComparaArreglosJSON( actualizaciones, camposPermitidos ) ){
        return res.status(400).send({ error:'JSON incluye campos no validos...'})
    }

        const id = req.params.id

        try{
            const usr = await User.findByIdAndUpdate(   id, // id del usuario a actualizar
                                                        req.body, // json que indicar que campos se actualizarán 
                                                        { new : true, runValidators : true } )// opciones: new-> que devulva el usuario nuevo actualizado, runValidator-> que corra la validaciones mongoose 
            if( ! usr ){
                return res.status(404).send()
            }
            res.status(200).send(usr)
        }
        catch (e){
            res.status(400).send(e)
        }

})

router.delete('/users/:id', async (req, res)=>{

    try{

        const usu = await User.findByIdAndDelete( req.params.id )
        if( !usu ){
            return res.status(404).send()
        }
        return res.send(usu)

    }catch(e){
        res.status(400).send(e)
    }



})

const isComparaArreglosJSON = ( origen, destino ) =>{

    const resultadoLogico = origen.every( (actual) => destino.includes(actual) )
    return resultadoLogico
}

module.exports = router