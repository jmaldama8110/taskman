
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/taskman-api',{  useNewUrlParser: true,
                                                        useCreateIndex: true,
                                                        useUnifiedTopology: true    } )



// const us1 = new User(    {name: 'CLAU', email : 'clau@moviltech.mx',age : 23, password : 'w172u1uw9182'} )

//         us1.save().then( (res)=>{
//             console.log(res)
//         }).catch((err)=>{
//             console.log(err)
//         })

// const task1 = new Task( {description:'Do the cleanning'} )

// task1.save().then((res)=>{
//     console.log(res)
// }).catch( (err)=>{
//     console.log(err)
// })
