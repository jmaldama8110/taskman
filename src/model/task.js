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
    }

})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task