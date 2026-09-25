import express from 'express'
import cors from 'cors'
import cargadoresRouter from './routes/cargadores.js'
import reservasRouter from './routes/reservas.js'
import usuariosRouter from './routes/usuarios.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json()) 

app.use('/cargadores', cargadoresRouter)
app.use('/reservas', reservasRouter)
app.use('/usuarios', usuariosRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
}) 