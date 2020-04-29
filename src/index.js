
const express = require('express')
require('./db/mongoose')
const User = require('./model/user')
const Task = require('./model/task')

const app = express()
const port = process.env.PORT || 3000

app.use( express.json() )


app.post('/users', (req, res)=>{

    const user = new User( req.body )

    user.save().then( (resultado)=>{
        res.status(201).send(user)
    } ).catch( (err)=>{
            res.status(400).send(err)
    })

})

app.get('/users', (req, res)=>{

    User.find({}).then( (users)=>{
        res.status(200).send(users)
    } ).catch( (err)=>{
            res.status(500).send(err)
    } )

})

app.get('/users/:id', (req, res)=>{

    const _id = req.params.id

    User.findById(_id).then( (usr1)=>{
            if( !usr1 ){
                return res.status(404).send()
            }
        res.status(200).send(usr1)
        
    }).catch( (err)=>{
        res.status(500).send(err)
    })

})


app.post('/tasks', (req, res) => {

    const task = new Task( req.body )

    task.save().then( (resultado)=>{
           res.status(201).send( task )
               
    } ).catch( (err) => {
        res.status(400).send(err)
    } )

})

app.get('/tasks/:id', (req, res)=>{

    const _id = req.params.id

    Task.findById(_id).then( (task1)=>{
        
        if( !task1 ) {
            return res.status(404).send()
        }
    res.status(200).send(task1)
    }).catch( (err)=>{
        res.status(500).send(err)
    })

})


app.listen(port, ()=>{
    console.log('Server is up and running...at ' + port)
})