import express from 'express'

const app = express()
const PORT = 3001

app.get('/', (req, res) => {
    res.json({ mensaje: 'Backend de EV Charger funcionando correctamente. Prueba' })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
}) 