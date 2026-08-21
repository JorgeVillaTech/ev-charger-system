import express from 'express'
import { cargadores, reservas } from '../data.js'
import { calcularRangoReserva } from '../utils.js'

const router = express.Router()

router.get('/disponibles', (req, res) => {
    const horaReserva = req.query.horaReserva
    const minutosReserva = req.query.minutosReserva

    const horaConsultada = calcularRangoReserva(horaReserva, minutosReserva)

    const cargadoresDisponibles = cargadores.filter(cargador => {
    const reservasDelCargador = reservas.filter(reserva => reserva.cargadorId === cargador.id)
    const traslape = reservasDelCargador.some(reserva => {
        const rangoReservaExistente = calcularRangoReserva(reserva.hora, reserva.duracionMinutos)
        return rangoReservaExistente.inicio < horaConsultada.fin && horaConsultada.inicio < rangoReservaExistente.fin
    })
    return !traslape
    })

    res.json({ mensaje: 'Cargadores disponibles', cargadores: cargadoresDisponibles })
})

router.get('/', (req, res) => {
    res.json(cargadores)
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    const cargador = cargadores.find(c => c.id === id)

    if (!cargador) {
    return res.status(404).json({ error: 'Cargador no encontrado' })
    }

    res.json({ mensaje: 'Cargador encontrado', cargador })
})

export default router