
const {MongoClient, ObjectID } = require('mongodb')

// const mongodb = require('mongodb')
// const mongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const id = new ObjectID()

console.log(id.id )
console.log( id.getTimestamp() )
console.log( id.toHexString() )

// definir  la conexion
const connectURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'taskman'

MongoClient.connect(connectURL,{ useUnifiedTopology: true }, (error, client )=> {

    if( error ){
        return console.log('error al conectarse...')
    }

    console.log('Conectado correctamente!')

    const db = client.db(databaseName)

    // db.collection('task').insertMany(
    //             [
    //             {   descripcion: 'Buscar Caca',
    //                 estado: false,
    //                 fecha: '01-Abr-2020'
    //             },
    //             {   descripcion: 'Hacer Pinole',
    //                 estado: true,
    //                 fecha: '02-Abr-2020'
    //             },
    //             {   descripcion: 'Tirar Soga',
    //                 estado: true,
    //                 fecha: '02-May-2020'
    //             }

    //             ], 
        
        
        
        
    //     (error, result ) => {

    //         if( error ){
    //             return console.log('Imposible inserta....')
    //         }

    //     console.log( result.ops )

    // } )

    //  db.collection('users').findOne( {_id : new ObjectID("5ea1f131aad404043d57ab6e") },  (error, task)=>{
    //      if( error ){
    //          return console.log('no se pudo encontrar...')
    //      }
    //      console.log( task )
    // })

    // const updatePromise = db.collection('users').updateOne(    
    //             {   _id: new ObjectID('5e9a093e08752406e6a3c6d6')   },
    //             {
    //                  $set: {
    //                      name: 'Jose Manuel'
    //                  }
    //                 //$inc:{ age: 1}
    //             })

    // updatePromise.then( (resultado)=>{
    //         console.log(resultado)
    // }).catch( (error ) =>{
    //         console.log(error)
    // })

    // db.collection('users').updateMany( 
    //         {  name: 'Claudia Gurria 12'     },
    //         {
    //             $set:   {
    //                 name: 'Claudia Gurria'
    //             }
    //         }).then( (resultado)=>{
    //             console.log(resultado)
    //         }).catch( (err) =>{
    //             console.log(err)
    //         })

    db.collection('users').deleteMany(
                                        { age : 38  })
                                        .then( (res)=>{
                                            console.log(res)
                                        }).catch( (err)=>{
                                            console.log(err)
                                        })

    // db.collection('task').find( { estado: true } ).count( (error, contador) =>{
    //     if( error ){
    //         return console.log('No se pudo encontrar obtener resultados...')
    //     }
    //     console.log(contador)
    // })






})