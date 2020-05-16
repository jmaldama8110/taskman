
const User = require('../../model/user')
const Task = require('../../model/task')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const user01Id = mongoose.Types.ObjectId()

const user01 = {
    _id: user01Id,
    name:"Miguel",
    email:"miguel@grupoconserva.mx",
    password:"123456",
    tokens: [   {       token: jwt.sign( { _id: user01Id }, process.env.JWT_SECRET_KEY )      } ] 
}

const user02Id = mongoose.Types.ObjectId()

const user02 = {
    _id: user02Id,
    name:"Josiman",
    email:"jmgomez@grupoconserva.mx",
    password:"123456",
    tokens: [   {       token: jwt.sign( { _id: user02Id }, process.env.JWT_SECRET_KEY )      } ] 
}

const task01 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Tarea una',
    createdby: user01Id
}

const task02Id = new mongoose.Types.ObjectId()

const task02 = {
    _id: task02Id,
    description: 'Tarea dos',
    createdby: user01Id
}

const task03 = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Tarea tres',
    createdby: user02Id
}


const initDatabase =  async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(user01).save()
    await new User(user02).save()
    await new Task(task01).save()
    await new Task(task02).save()
    await new Task(task03).save()

}

module.exports = {
    user01,
    user01Id,
    user02,
    task02Id,
    initDatabase
}