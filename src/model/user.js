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
        required: true,
        trim: true,
        validate(value){
            if( ! (validador.isEmail(value)) ){
                throw new Error('Correo electronico no valido..')
            }   
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value){

            if( value < 1 ){
                throw new Error('Edad no valida..')
            }   
        }
    },
    password:{
        type: String,
        trim: true,
        validate(pass){
            if( ! (validador.isLength( pass, { min:6 } ) )  ){
                throw new Error('Longitud minimo 6 ')
            }

        }
    },
    phone:{
        type: String,
        trim: true,
        validate(celphone){
            if( ! (validador.isLength( celphone, { min:10 } ) )  ){
                throw new Error('Phone number no less than 10 ')
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
    
    const jwt_secret_key = process.env.JWT_SECRET_KEY
    const token  = jwt.sign(    {   _id : user._id.toString() }, jwt_secret_key)

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