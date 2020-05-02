const express = require('express')
const router = new express.Router()
const Task = require('../model/task')

router.post('/tasks', async (req, res) => {
    const task = new Task( req.body )

    try{
        await task.save()
        res.status(201).send( task )
    }
    catch (err){
        res.status(400).send(err)
    }


})

router.get('/tasks', async (req, res)=>{
    try{
        const tasks = await Task.find( {} )
        res.status(200).send(tasks)
    }
    catch (err){
        res.status(500).send(err)
    }


})

router.get('/tasks/:id', async (req, res)=>{

    const _id = req.params.id

    try{
        task1 = await Task.findById(_id)
        if (!task1){
            return res.status(404).send()
        }
        res.status(200).send(task1)
    }
    catch (err) {
        res.status(500).send(err)
    }


})

router.patch('/tasks/:id', async (req, res)=>{

    const camposRequest = Object.keys(req.body)
    const camposValidos = ["description","status" ]

    if( !isComparaArreglosJSON( camposRequest, camposValidos ) ){
        return res.status(404).send(    { error: "JSON con campos no validos..."}  )
    }
   
    const id = req.params.id

    try{

        const tsk = Task.findById(id)

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

router.delete('/tasks/:id', async (req, res)=>{

        try{
            const task = await Task.findByIdAndDelete( req.params.id )
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