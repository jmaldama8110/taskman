const mongoose = require('mongoose')
const validador = require('validator')
const bcrypt = require('bcryptjs')

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
    }

})

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


const User = mongoose.model('User',userSchema )

module.exports = User