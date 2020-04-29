const mongoose = require('mongoose')
const validador = require('validator')

const User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
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
            if( ! (validador.isLength( value, { min:6, max:12 } ) )  ){
                throw new Error('Longitud minimo 6 maximo 12')
            }

        }
    }
})

module.exports = User