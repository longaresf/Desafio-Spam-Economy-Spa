// Importar módulos
const nodemailer = require('nodemailer');

// Función que se exporta para enviar los correos
function enviar(to,subject,text) {

    // Variable que guarda el llamada al método createTransport con sus parámetros de configuración
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth:{
                user: 'email.test.backend@gmail.com',
                pass: 'backendtesting'
            }
        }
    )

    // Variable que guarda las opciones del correo
    let mailOptions = {
        from: 'email.test.backend@gmail.com',
        to: to,
        subject: subject,
        text: text,
    }
    
    // Invocación al método sendMail de la instancia transporter pasándole como argumentos las opciones del correo
    // y un callback con el error y la data correpondiente al envío
    transporter.sendMail(mailOptions, (err,data) => {
        if (err) console.log(err);
        if (data) console.log(data);
    })
}


module.exports = enviar;

