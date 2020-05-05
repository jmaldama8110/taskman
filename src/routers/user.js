const express = require('express')
const router = new express.Router()
const User = require('../model/user')
const auth = require('../middleware/auth')

router.get('/users/me', auth, async (req, res)=>{ // GET perfil del usuario
    res.send( req.user )
    
})

// SE ELIMINA ESTE ENDPOINT ya no es necesario
// router.get('/users/:id', async (req, res)=>{ // 
    
//     const _id = req.params.id
    
//     try{
//         const usr1 = await User.findById( _id )
//         if ( !usr1 ){
//             return res.status(404).send()
//         }
//         res.status(200).send(usr1)
//     }
//     catch (err){
//         res.status(500).send(err)
//     }
    
// })

router.patch('/users/me',auth, async (req, res)=>{ // PATCH (actualiza) usuario
    
    const actualizaciones = Object.keys( req.body )
    const camposPermitidos = ['name', 'email', 'password', 'age']
    
    if( !isComparaArreglosJSON( actualizaciones, camposPermitidos ) ){
        return res.status(400).send({ error:'JSON incluye campos no validos...'})
    }

    try{

        actualizaciones.forEach( (valor) => req.user[valor] = req.body[valor])

        await req.user.save()
        res.status(200).send(req.user)
    }
    catch (e){
        res.status(400).send(e)
    }
    
})

router.delete('/users/me',auth, async (req, res)=>{ // elimina mi usuario (quien esta logeado)
    
    try{
        
        await req.user.remove()
        return res.send(req.user)
        
    }catch(e){
        res.status(400).send(e)
    }
    
    
    
})

router.post('/users', async (req, res)=>{ // crea un nuevo usuario

    const user = new User( req.body )

    try{
        const token = await user.generateAuthToken()
        //await user.save()
        res.status(201).send( { user, token } )
    }
    catch (err) {
        res.status(400).send(err)
    }

})

router.post('/users/login',async (req, res)=>{ // Enviar peticion Login, generar un nuevo token

    try{
            const user = await User.findUserByCredentials( req.body.email, req.body.password )
            const token = await user.generateAuthToken()

            res.send( { user: user, token } )

    }catch(error){
        res.status(400).send(error)
    }

})

router.post('/users/logout',auth ,async (req, res)=>{ // Enviar peticion de Logout, elimina el token actual

    try{
        req.user.tokens = req.user.tokens.filter( (token)=>{
            return token.token !== req.currentToken
        })

        await req.user.save()
        res.send()

    }catch(error){
        res.status(500).send()
    }

})

router.post('/users/logoutall',auth, async (req, res)=>{ // Envia peticion de Logout de todos los tokens generados, elimina todos los tokens

    try{
        
        req.user.tokens = []
        await req.user.save()
        res.send()

    }catch(error){
        res.status(500).send()
    }

})

const isComparaArreglosJSON = ( origen, destino ) =>{

    const resultadoLogico = origen.every( (actual) => destino.includes(actual) )
    return resultadoLogico
}

module.exports = router