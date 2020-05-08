
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client  = require('twilio')(accountSid , authToken )


const sendWelcomeSMS = ( to, body )=> {

    const from = process.env.TWILIO_PRONE_NUMBER_FROM // Numero comprado en Twilio
    
        client.messages.create({
            to,
            from,
            body

        }).then((message)=>{
            console.log(message)
        })
    

}

module.exports = sendWelcomeSMS