const express = require('express')
const router = new express.Router()
const Task = require('../model/task')
const auth = require('../middleware/auth')


// POST crear una tarea del usuario logeado
router.post('/tasks',auth, async (req, res) => {
    
    //const task = new Task( req.body )

    const task = new Task( {    ...req.body,
                                createdby: req.user._id 
                                    } )
    try{
        await task.save()
        res.status(201).send( task )
    }
    catch (err){
        res.status(400).send(err)
    }


})

// GET obtener todas las tareas del usuario logeado
router.get('/tasks',auth, async (req, res)=>{
    try{
        const tasks = await Task.find( { createdby: req.user._id } )
        res.status(200).send(tasks)
    }
    catch (err){
        res.status(500).send(err)
    }

 })


// GET obtener una tarea por Id, del usuario logeado
router.get('/tasks/:id',auth, async (req, res)=>{

    const _id = req.params.id

    try{

        task1 = await Task.findOne( {_id, createdby: req.user._id})

        if (!task1){
            return res.status(404).send()
        }
        res.status(200).send(task1)
    }
    catch (err) {
        res.status(500).send(err)
    }


})

// PATCH actualizar una tarea por Id del usuario logeado
router.patch('/tasks/:id',auth, async (req, res)=>{

    const camposRequest = Object.keys(req.body)
    const camposValidos = ["description","status" ]

    if( !isComparaArreglosJSON( camposRequest, camposValidos ) ){
        return res.status(404).send(    { error: "JSON con campos no validos..."}  )
    }
   
    const _id = req.params.id

    try{

        const tsk = await Task.findById({_id, createdby: req.user._id })

        // const tsk = await Task.findByIdAndUpdate(   id, // id de Task a actualizar
        //                                             req.body, // json que indicar que campos se actualizarán 
        //                                             { new : true, runValidators : true } )// opciones: new-> que devulva el registro nuevo actualizado, runValidator-> que corra la validaciones mongoose 
        if( !tsk ){
            return res.status(404).send()
        }

        camposRequest.forEach( (valor)=> tsk[valor] = req.body[valor] )
        await tsk.save()

        res.status(200).send(tsk)
    }
    catch (e){
        res.status(400).send(e)
    }


})

// DELETE borrar una tarea por Id del usuario logueado

router.delete('/tasks/:id',auth, async (req, res)=>{

    const _id = req.params.id

        try{
            const task = await Task.findByIdAndDelete( {_id, createdby: req.user._id } )
            if( !task ){
                return res.status(404).send()
            }
            res.status(200).send(task)
        }catch(e){
            res.status(400).send(e)
        }
})


const isComparaArreglosJSON = ( origen, destino ) =>{

    const resultadoLogico = origen.every( (actual) => destino.includes(actual) )
    return resultadoLogico
}


module.exports = router