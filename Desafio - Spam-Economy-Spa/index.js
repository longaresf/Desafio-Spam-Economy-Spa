// Importación de módulos necesarios
const enviar = require('./mailer');
const http = require('http');
const url = require('url');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Crea servidor http
http
    .createServer( (req,res) => {

        // Obtiene valores de los campos del formulario a través de parámetros en la url
        let { correos,asunto,contenido } = url.parse(req.url,true).query;

        // Ruta raíz que disponibiliza el formulario
        if (req.url == '/') {
            res.setHeader('content-type','text/html');
            fs.readFile('index.html','utf8',(err,data) => {
                res.end(data);
            })
        }

        // Ruta que sirve para enviar los correos
        if (req.url.startsWith('/mailing')) {

            // Variables para almacenar los valores de los indicadores económicos
            let valorDolar;
            let valorEuro;
            let valorUF;
            let valorUTM;

            // Función asincrónica para obtener datos de la API a través de axios
            async function getData() {
            
                let { data } = await axios.get('https://mindicador.cl/api');

                valorDolar = data.dolar.valor;
                valorEuro = data.euro.valor;
                valorUF = data.uf.valor;
                valorUTM = data.utm.valor;
            }

            // Llamada a la función y funciones callback a través de promesas
            getData()
                .then( () => { 
                    // Concatena los valores de indicadores económicos al contenido del correo
                    // y retorna los valores para las variables correos, asunto y contenido
                    
                    contenido += `\nEl valor del dólar del día de hoy es: ${valorDolar}
                    \nEl valor del euro del día de hoy es: ${valorEuro}
                    \nEl valor del uf del día de hoy es: ${valorUF}
                    \nEl valor del utm del día de hoy es: ${valorUTM}
                    `;

                    return correos,asunto,contenido;
                })
                .then( () => { 
                    
                    // Envía el correo a través de la función enviar() luego de que pasa positivamente
                    // las validaciones y envía el mensaje de éxito,
                    // o se envía un mensaje de error si no pasa las validaciones
                    if ( (correos !== '') && (asunto !== '') && (contenido !== '') && (correos.includes(','))) {
                        enviar(correos.split(','),asunto,contenido);
                        console.log(`El correo fue enviado con éxito a los destinatarios: ${correos}`);

                        res.write('El correo fue enviado con exito.');
                        res.end();

                        // Genera una id para cada archivo de correo que se almacenará
                        let id = uuidv4();

                        // Almacena un archivo con un identificador único para cada correo
                        fs.writeFile(`correos/correo_id_${id}`,`Correos:${correos}\n\nAsunto: ${asunto}\n\nContenido:\n${contenido}`,'utf8', () => {
                                console.log(`Archivo para el correo_id_${id} creado con éxito!`);
                            })
                    }
                    else {
                        res.write('Faltan campos por llenar o se esta intentando un correo con solo 1 direccion');
                        res.end();
                    }
                });
            
        }
    })
    .listen(3000,() => { console.log('Escuchando el puerto 3000.')})