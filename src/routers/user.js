const express = require('express')
const router = new express.Router()
const User = require('../model/user')
const auth = require('../middleware/auth')

const multer = require('multer') // parar cargar imagenes
const sharp = require('sharp')


router.get('/users/me', auth, async (req, res)=>{ // GET perfil del usuario
    res.send( req.user )
    
})


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


const upload = multer({
    //dest: 'avatars', commentado para evitar que envie el archivo sea enviado a la carpeta avatars
    limits:{
        fileSize: 1000000 // 1,0 megabytes
    },
    fileFilter(req, file, cb ){ // cb -> callback function
        
        if( !file.originalname.match(/\.(png|jpg|jpeg)$/) ){ // Expresion regular-> checar regex101.com
            return cb( new Error('Not a valid image.. use only PNG, JPEG, JPG') )
        }
        
        cb( undefined, true )
        // cb( new Error('file type in not accepted') )
        // cb( undefined, true )
        // cb( undefined, false )
    }
})

// POST actualizar imagen avater del usuario autenticado
router.post('/users/me/avatar', auth, upload.single('avatar'), async ( req, res )=>{

    const buffer = await sharp(req.file.buffer).resize( { width:250, height:250 } ).png().toBuffer()

    req.user.avatar = buffer

    await req.user.save()

    res.send()

}, (error, req, res, next)=>{  // handle error while loading upload
    res.status(400).send({error: error.message})
} )


// DELETE elminar el avatar del usuario autenticado
router.delete('/users/me/avatar',auth, async ( req, res ) => {

    req.user.avatar = undefined
    await req.user.save()

    res.send()
})

// GET obtener el avatar de cualquier usuario (sin estar logeado)
router.get('/users/:id/avatar', async ( req, res )=> {

        try{
            const user = await User.findById( req.params.id )

            if( !user || !user.avatar ){
                throw new Error()
            }

            res.set('Content-Type','image/png') // respues en modo imagen desde el server
            res.send(user.avatar) // send -> campo buffer

        }catch(error){
            res.status(404).send()
        }

})

const isComparaArreglosJSON = ( origen, destino ) =>{

    const resultadoLogico = origen.every( (actual) => destino.includes(actual) )
    return resultadoLogico
}

module.exports = router