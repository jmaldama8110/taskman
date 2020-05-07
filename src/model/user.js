const mongoose = require('mongoose')
const validador = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../model/task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        requiered: true,
        trim: true,
        validate(value){
            if( ! (validador.isEmail(value)) ){
                throw new Error('Correo electronico no valido..')
            }   
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value){

            if( value < 1 ){
                throw new Error('Edad no valida..')
            }   
        }
    },
    password:{
        type: String,
        trim: true,
        validate(value){
            if( ! (validador.isLength( value, { min:6 } ) )  ){
                throw new Error('Longitud minimo 6 ')
            }

        }
    },
    avatar:{
        type: Buffer,
        required: false
    },

    tokens: [{
            token:{
                type: String,
                required: true
            }
        }]

},
{ timestamps: true } )

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'createdby'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token  = jwt.sign(    {   _id : user._id.toString() }, 'thisismycourse')

    user.tokens = user.tokens.concat( { token } )
    await user.save()

    return token
}

userSchema.methods.toJSON = function(){
    const user = this

    const userPublic = user.toObject()
    
    delete userPublic.password
    delete userPublic.tokens
    delete userPublic.avatar

    return userPublic

    
}

userSchema.statics.findUserByCredentials = async ( email, password ) => {
    const user = await User.findOne( {email} )

    if( !user ){
        throw new Error('No puede logearse...')
    }

    const isMatch = await bcrypt.compare( password, user.password )

    if( !isMatch ){
        throw new Error ('No puede logearse...')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if ( user.isModified('password') ){
        user.password = await bcrypt.hash(user.password,8)
    }
    
    next()
} )

userSchema.pre('remove', async function(next) {

    const user = this
    await Task.deleteMany( { createdby: user._id })
    next()
    
})


const User = mongoose.model('User',userSchema )

module.exports = User