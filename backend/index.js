import express from 'express'
import cargadoresRouter from './routes/cargadores.js'
import reservasRouter from './routes/reservas.js'

const app = express()
const PORT = 3001

app.use(express.json()) 

app.use('/cargadores', cargadoresRouter)
app.use('/reservas', reservasRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
}) 