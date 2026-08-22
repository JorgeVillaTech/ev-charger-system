import express from 'express'
import db from '../db.js'
import { calcularRangoReserva } from '../utils.js'

const router = express.Router()

router.get('/disponibles', (req, res) => {
    const horaReserva = req.query.horaReserva
    const minutosReserva = req.query.minutosReserva

    const horaConsultada = calcularRangoReserva(horaReserva, minutosReserva)
    const cargadores = db.prepare('SELECT * FROM cargadores').all()

    const cargadoresDisponibles = cargadores.filter(cargador => {
    const reservasDelCargador = db.prepare('SELECT * FROM reservas WHERE cargadorId = ?').all(cargador.id)
    const traslape = reservasDelCargador.some(reserva => {
        const rangoReservaExistente = calcularRangoReserva(reserva.hora, reserva.duracionMinutos)
        return rangoReservaExistente.inicio < horaConsultada.fin && horaConsultada.inicio < rangoReservaExistente.fin
    })
    return !traslape
    })

    res.json({ mensaje: 'Cargadores disponibles', cargadores: cargadoresDisponibles })
})

router.get('/', (req, res) => {
    const cargadores = db.prepare('SELECT * FROM cargadores').all()
    res.json(cargadores)
})

router.get('/:id', (req, res) => {
    const { id } = req.params
  const cargador = db.prepare('SELECT * FROM cargadores WHERE id = ?').get(id)

    if (!cargador) {
    return res.status(404).json({ error: 'Cargador no encontrado' })
    }

    res.json({ mensaje: 'Cargador encontrado', cargador })
})

export default router