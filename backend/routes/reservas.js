import express from 'express'
import { cargadores, reservas } from '../data.js'
import { calcularRangoReserva } from '../utils.js'

const router = express.Router()

router.get('/', (req, res) => {
    res.json(reservas)
})

router.post('/', (req, res) => {
const { cargadorId, hora, duracionMinutos } = req.body

if (!cargadorId || !hora || !duracionMinutos) { 
    return res.status(400).json({ error: 'Faltan datos: cargadorId, hora y duracionMinutos son obligatorios' })
}

if (duracionMinutos < 30 || duracionMinutos > 180) {
    return res.status(400).json({ error: 'La duración debe estar entre 30 y 180 minutos' })
}

if (!cargadores.some(cargador => cargador.id === cargadorId)) {
    return res.status(400).json({ error: 'El cargador solicitado no existe.' })
}

const rangoHoraNuevaReserva = calcularRangoReserva(hora, duracionMinutos)

const reservasMismoCargador = reservas.filter(reserva => reserva.cargadorId === cargadorId)

const haySobreposicion = reservasMismoCargador.some(reserva => {
    const rangoReservaExistente = calcularRangoReserva(reserva.hora, reserva.duracionMinutos)
    return rangoReservaExistente.inicio < rangoHoraNuevaReserva.fin && rangoHoraNuevaReserva.inicio < rangoReservaExistente.fin
})

if (haySobreposicion) {
    return res.status(409).json({ error: 'El cargador ya está reservado en ese horario, revise la disponibilidad de los cargadores.' })
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

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = reservas.findIndex(reserva => reserva.id === parseInt(id)); 
    
    if (index === -1) { 
        return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    reservas.splice(index, 1); 
    res.json({ mensaje: 'Reserva eliminada correctamente' });
})

export default router