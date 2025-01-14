import express from "express"
import session from "express-session"
import moment from "moment-timezone"

const app = express()

app.use(
    session({
        secret:'p4-MCO#gato-sesioneshttp',
        resave:false,
        saveUninitialized:true,
        cookie:{maxAge:24 * 60 * 60 * 100}
    })
)

app.get('/iniciar-sesion',(req,res)=>{
    if(!req.session.inicio){
        req.session.inicio = new Date()
        req.session.ultimoAcceso = new Date()
        res.send('Sesión iniciada')
    }else{
        res.send('La sesión ya está activa')
    }
})

app.get('/actualizar',(req,res)=>{
    if(!req.session.inicio){
        req.session.ultimoAcceso = new Date()
        res.send('Fecha de última consulta actualizada')
    }else{
        res.send('No hay una sesión activa')
    }
})

app.get('/estado-sesion',(req,res)=>{
    if(req.session.inicio){
        const inicio = new Date(req.session.inicio)
        const ultimoAcceso = new Date(req.session.ultimoAcceso)
        const ahora = new Date()

        if(isNaN(inicio.getTime()) || isNaN(ultimoAcceso.getTime())){
            return res.status(400).json({mensaje:'Datos de sesión inválidos'})
        }

        const antiguedadMs = ahora - inicio
        const horas = Math.floor(antiguedadMs / (1000*60*60))
        const minutos = Math.floor((antiguedadMs % (1000*60*60))*(1000*60))
        const segundos = Math.floor((antiguedadMs % (1000*60))/1000)

        const inicioCDMX = moment(inicio).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')
        const ultimoAccesoCDMX = moment(ultimoAcceso).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss')

        res.json({
            mensaje: 'Estado de la sesión',
            sesionId: req.session.id,
            inicio:inicioCDMX,
            ultimoAcceso:ultimoAccesoCDMX,
            antiguedad:`${horas} horas, ${minutos} minutos, ${segundos} segundos`
        })
    }else{
        res.send('No hay sesión activa')
    }
})

app.get('/cerrar-sesion',(req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                return res.status(500).send('Error al cargar la sesión')
            }
            res.send('Sesión cerrada correctamente')
        })
    }
})


const PORT = 3005
app.listen(PORT,()=>{
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})