import express from 'express'
import db from '../db.js'
import { calcularRangoReserva } from '../utils.js'

const router = express.Router()

router.get('/', (req, res) => {
    const reservas = db.prepare('SELECT * FROM reservas').all()
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

    const cargador = db.prepare('SELECT * FROM cargadores WHERE id = ?').get(cargadorId)

    if (!cargador) {
        return res.status(400).json({ error: 'El cargador solicitado no existe.' })
    }

    const rangoHoraNuevaReserva = calcularRangoReserva(hora, duracionMinutos)

    const reservasMismoCargador = db.prepare('SELECT * FROM reservas WHERE cargadorId = ?').all(cargadorId)

    const haySobreposicion = reservasMismoCargador.some(reserva => {
        const rangoReservaExistente = calcularRangoReserva(reserva.hora, reserva.duracionMinutos)
        return rangoReservaExistente.inicio < rangoHoraNuevaReserva.fin && rangoHoraNuevaReserva.inicio < rangoReservaExistente.fin
    })

    if (haySobreposicion) {
        return res.status(409).json({ error: 'El cargador ya está reservado en ese horario, revise la disponibilidad de los cargadores.' })
    }

    const resultado = db.prepare('INSERT INTO reservas (cargadorId, hora, duracionMinutos) VALUES (?, ?, ?)').run(cargadorId, hora, duracionMinutos)

    const nuevaReserva = {
    id: resultado.lastInsertRowid,
    cargadorId,
    hora,
    duracionMinutos,
    }

    res.status(201).json({ mensaje: 'Reserva confirmada', reserva: nuevaReserva })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params

    const reserva = db.prepare('SELECT * FROM reservas WHERE id = ?').get(id)

    if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    db.prepare('DELETE FROM reservas WHERE id = ?').run(id)

    res.json({ mensaje: 'Reserva eliminada correctamente' })
})

export default router