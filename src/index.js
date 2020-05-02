
const express = require('express')
require('./db/mongoose')
const User = require('./model/user')
const Task = require('./model/task')

const app = express()
const port = process.env.PORT || 3000

app.use( express.json() )


app.post('/users', async (req, res)=>{

    const user = new User( req.body )

    try{
        await user.save()
        res.status(201).send(user)
    }
    catch (err) {
        res.status(400).send(err)
    }

})

app.get('/users', async (req, res)=>{

    try{
        const lsU = await User.find( {} )
        res.send(lsU)
    }
    catch(err){
        res.status(500).send(err)
    }

})

app.get('/users/:id', async (req, res)=>{

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

app.patch('/users/:id', async (req, res)=>{

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

app.delete('/users/:id', async (req, res)=>{

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


app.post('/tasks', async (req, res) => {

    const task = new Task( req.body )

    try{
        await task.save()
        res.status(201).send( task )
    }
    catch (err){
        res.status(400).send(err)
    }


})

app.get('/tasks', async (req, res)=>{


    try{
        const tasks = await Task.find( {} )
        res.status(200).send(tasks)
    }
    catch (err){
        res.status(500).send(err)
    }


})

app.get('/tasks/:id', async (req, res)=>{

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

app.patch('/tasks/:id', async (req, res)=>{

    const camposRequest = Object.keys(req.body)
    const camposValidos = ["description","status" ]

    if( !isComparaArreglosJSON( camposRequest, camposValidos ) ){
        return res.status(404).send(    { error: "JSON con campos no validos..."}  )
    }
   
    const id = req.params.id

    try{
        const tsk = await Task.findByIdAndUpdate(   id, // id de Task a actualizar
                                                    req.body, // json que indicar que campos se actualizarán 
                                                    { new : true, runValidators : true } )// opciones: new-> que devulva el registro nuevo actualizado, runValidator-> que corra la validaciones mongoose 
        if( !tsk ){
            return res.status(404).send()
        }
        res.status(200).send(tsk)
    }
    catch (e){
        res.status(400).send(e)
    }


})

app.delete('/tasks/:id', async (req, res)=>{

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


app.listen(port, ()=>{
    console.log('Server is up and running...at ' + port)
})