const app = require('../app')
const request = require('supertest')
const { 
        user01,
        user01Id,
        user02,
        task02Id,
        initDatabase } = require('../tests/fixtures/db')

const Task = require('../model/task')

beforeEach(initDatabase)

test('Debe crear una tarea para un usuario...', async () =>{
    const res = await  request(app)
                            .post('/tasks')
                            .set('Authorization',`Bearer ${user01.tokens[0].token}`)
                            .send({
                                description:'Prueba demo'
                            })
                            .expect(201)
                           
    const task = await Task.findById( res.body._id )
    
    expect(task).not.toBeNull()
    expect(task.status).toEqual(false)

})

test('Debe devolver el numero correcto de tareas en un Array', async() =>{

    const res = await   request(app)
                        .get('/tasks')
                        .set('Authorization',`Bearer ${user01.tokens[0].token}`)
                        .send()
                        .expect(200)
    
    expect(res.body.length).toBe(2)
    
})

test('NO debe permitir que un usuario elimine una tarea de otro..', async()=>{
        const res = await       request(app)
                                .delete('/tasks/' + task02Id)
                                .set('Authorization',`Bearer ${user02.tokens[0].token}`)
                                .send()
                                .expect(404)

    const task = await Task.findById( task02Id )
    console.log(task)
    expect(task).not.toBeNull()

})

