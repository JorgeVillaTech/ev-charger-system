import express from 'express'

const app = express()
const PORT = 3001

app.use(express.json()) 

const cargadores = [
    { id: 'A5', estado: 'disponible' },
    { id: 'A6', estado: 'ocupado' },
    { id: 'B1', estado: 'ocupado' },
    { id: 'C10', estado: 'disponible' },
]

const reservas = []

app.get('/', (req, res) => {
    res.json({ mensaje: 'Backend de EV Charger funcionando' })
})

app.get('/cargadores', (req, res) => {
    res.json(cargadores)
})

app.get('/cargadores/:id', (req, res) => {
    const { id } = req.params;
    const cargador = cargadores.find(cargador => cargador.id === id);

    if (!cargador) {
        return res.status(404).json({ error: 'Cargador no encontrado' })
    }

    res.json({mensaje: 'Cargador encontrado', cargador})
})

app.get('/reservas', (req, res) => {
    res.json(reservas)
})

app.post('/reservas', (req, res) => {
const { cargadorId, hora, duracionMinutos } = req.body

if (!cargadorId || !hora || !duracionMinutos) { 
    return res.status(400).json({ error: 'Faltan datos: cargadorId, hora y duracionMinutos son obligatorios' })
}

if (duracionMinutos < 30 || duracionMinutos > 180) {
    return res.status(400).json({ error: 'La duración debe estar entre 30 y 180 minutos' })
}

const nuevaReserva = {
    id: reservas.length + 1,
    cargadorId,
    hora,
    duracionMinutos,
}

    reservas.push(nuevaReserva)

    res.status(201).json({ mensaje: 'Reserva confirmada', reserva: nuevaReserva })
})

app.delete('/reservas/:id', (req, res) => {
    const { id } = req.params;
    const index = reservas.findIndex(reserva => reserva.id === parseInt(id)); 
    
    if (index === -1) { 
        return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    reservas.splice(index, 1); 
    res.json({ mensaje: 'Reserva eliminada correctamente' });
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})