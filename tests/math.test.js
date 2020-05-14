const {calcularProp, suma } = require('../src/math')

test('Debe calcular la propina..' , ()=>{
    const total = calcularProp(100,0.2)

    expect(total).toBe(120)
})

// test('Debe calcuarl propopian por default..',()=>{
//     const total = calcularProp(100)
//     expect(total).toBe(110)
// })


// test('Async functions test...',(hecho)=>{

//     setTimeout( ()=>{
//         expect(1).toBe(2)
//         hecho()
//     },2000)

// })


// test('Suma test..', ( fin )=>{

//     suma( 2,3 ).then( (res)=>{
//             expect(res).toBe(5)
//             fin()
//     })

// })

// test('Suma con async/await ', async() =>{

//     const sum = await suma( 2,3)
//     expect(sum).toBe(5)
// })
