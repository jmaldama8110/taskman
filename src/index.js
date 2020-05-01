
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


app.listen(port, ()=>{
    console.log('Server is up and running...at ' + port)
})