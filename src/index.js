
const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000



app.use( express.json() )
app.use(userRouter)
app.use(taskRouter)


app.listen(port, ()=>{
    console.log('Server is up and running...at ' + port)
})

const Task = require('./model/task')
const User = require('./model/user')

const funcion = async ()=>{
    // const task = await Task.findById ('5eb18022b7c2c5050da93e90')
    // await task.populate('createdby').execPopulate()
    // console.log(task.createdby)

    const user = await User.findById('5eb17cb7eb19dc043f923acb')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)

}
//funcion()