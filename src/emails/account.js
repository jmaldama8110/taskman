
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = ( email, name )=>{
 
    sgMail.send({
        to: email,
        from: 'jmgomez@moviltech.mx',
        subject: `${name} Bienvenido a Taskman!`,
        text: `Bienvenido ${name} a nuestra comunidad`
    })

}
const sendGoodbyEmail = (email, name) =>{

    sgMail.send({
        to: email,
        from: 'jmgomez@moviltech.mx',
        subject: `${name}Que pena que te vas`,
        text: `Sentimos mucho ${name} que te vas, si podemos hacer algo para que regrese, por favor reponde con tus comentarios a este correo. Saludos y esperamos verte pronto...`
    })

}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyEmail
}