
const app = require('../app')
const request = require('supertest')
const User = require('../model/user')
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

const user02 = {
    name:"JM Gomez",
    email:"jm@gmail.mx",
    password:"123456" }


beforeEach( async () => {
    await User.deleteMany()
    await new User(user01).save()

})

test('Debe crear usuario de prueba ..', async () => {
    
    // prueba la respuesta del servicio POST /users/ que devuelva 201
    const res = await  request(app)
                        .post('/users')
                        .send( user02 )
                        .expect(201)



    // // Prueba que lo devuelto en el cuerpo de la respuesta (res), este en la base de datos
    const user = await User.findById( res.body.user._id )
    expect(user).not.toBeNull()
    

    // // Validar las propiedades de los objetos, en este caso la respuesta (res) trae tanto USER como TOKEN
    expect(res.body).toMatchObject({
        user:{
            name: 'JM Gomez',
            email: 'jm@gmail.mx'
        },
        token: user.tokens[0].token
    })

    // // valida que el password no se haya guardado de forma plana
    expect(user.password).not.toBe('123456')

})

test('Debe loguear un usuario existente...', async ()=>{

    const res = await   request(app).post('/users/login')
                        .send({
                            email: user01.email,
                            password: user01.password
                            })
                        .expect(200)

    const user = await User.findById(res.body.user._id)

    expect(user).not.toBeNull()
    expect(user.tokens[1].token).toBe(res.body.token)
    
})

test('Loguear usuario inexistente..', async () => {
        await request(app).post('/users/login').send({
                                                email: user02.email,
                                                password: user02.password
                                            }).expect(400)
})

test('Obtener el perfil del usuario users/me ..', async () =>{

    await   request(app)
            .get('/users/me')
            .set('Authorization',`${user01.tokens[0].token}`)
            .send()
            .expect(200)
})

test('No debe obtener el perfil cuando NO esta autenticado..', async() =>{
        await   request(app)
                .get('/users/me')
                .send()
                .expect(401)
})

test('Debe permitir eliminar si el usuario esta logueado...',async() =>{

    const res = await   request(app)
                        .delete('/users/me')
                        .set('Authorization',`Bearer ${user01.tokens[0].token}`)
                        .send()
                        .expect(200)

    const user = await User.findById( user01Id )
    expect(user).toBeNull()


})

test('No debe permitir eliminar usuario NO logueado...', async () =>{
    
    await   request(app)
            .delete('/users/me')
            .send()
            .expect(401)

})

test('Debe cargar la imagen de avatar..', async ()=> {

    await   request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${user01.tokens[0].token}` )
            .attach('avatar', 'src/tests/fixtures/avatar.jpeg')
            .expect(200)

    const user = await User.findById( user01Id )
    
    expect(user.avatar).toEqual( expect.any(Buffer) )

})



test('Debe actualizar campo validos de USER..', async () =>{

        await   request(app)
                .patch('/users/me')
                .set('Authorization',`Bearer ${user01.tokens[0].token}`)
                .send({
                    name: 'Miguel Juan',
                    age: 29,
                    phone:'9612338665'
                })
                .expect(200)
})

 test('NO debe permitir actualizar campos invalidos de USER..', async() =>{
                await   request(app)
                .patch('/users/me')
                .set('Authorization',`Bearer ${user01.tokens[0].token}`)
                .send({
                    name: 'Miguel Juan',
                    age: 29,
                    address:'FLAMBLOYANT 150' // campo invalido 
                })
                .expect(400)

})




