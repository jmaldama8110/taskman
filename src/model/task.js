const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

},{ timestamps: true})

// Override para devolver el JSON en la respuesta a peticion, ocultando campos si es necesario

// taskSchema.methods.toJSON = function () {
//     const task = this
    
//     const taskPublic = task.toObject()

//     delete taskPublic.createdby
//     delete taskPublic.createdAt
//     delete taskPublic.updatedAt
//     delete taskPublic._id
//     delete taskPublic.__v

//     return taskPublic
// }

const Task = mongoose.model('Task', taskSchema)

module.exports = Task