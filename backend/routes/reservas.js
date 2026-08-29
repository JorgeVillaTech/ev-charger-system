import express from 'express'
import db from '../db.js'
import { calcularRangoReserva, horaAMinutos } from '../utils.js'

const router = express.Router()

router.get('/', (req, res) => {
    const reservas = db.prepare('SELECT * FROM reservas').all()
    res.json(reservas)
})

router.get('/usuario/:usuarioId/recientes', (req, res) => {
    const { usuarioId } = req.params
    const reservas = db.prepare(`SELECT * FROM reservas WHERE usuarioId = ? AND fecha >= date('now', '-2 days')`).all(usuarioId)
    res.json(reservas)
})

router.get('/usuario/:usuarioId', (req, res) => {
    const { usuarioId } = req.params
    const reservasDelUsuario = db.prepare('SELECT * FROM reservas WHERE usuarioId = ?').all(usuarioId)
    res.json(reservasDelUsuario)
})

router.post('/', (req, res) => {
    const { cargadorId, hora, duracionMinutos, usuarioId } = req.body
    
    if (!cargadorId || !hora || !duracionMinutos || !usuarioId) {
        return res.status(400).json({ error: 'Faltan datos: cargadorId, hora, duracionMinutos y el ID del usuario son obligatorios' })
    }

    const duracionMinutosNumero = parseInt(duracionMinutos)
    
    const horaLimiteApertura = horaAMinutos('06:00');
    const horaLimiteCierre = horaAMinutos('22:30');
    const rangoHoraNuevaReserva = calcularRangoReserva(hora, duracionMinutosNumero)

    if (rangoHoraNuevaReserva.inicio < horaLimiteApertura){
        return res.status(400).json({error: 'No se pueden hacer reservas antes de las 6:00 am.'})
    }

    if (rangoHoraNuevaReserva.fin > horaLimiteCierre){
        return res.status(400).json({error: 'No se puede hacer reservas que pasen de las 10:30 pm'})
    }

    if (duracionMinutosNumero < 30 || duracionMinutosNumero > 180) {
        return res.status(400).json({ error: 'La duración debe estar entre 30 y 180 minutos' })
    }

    const usuarioConfirmado = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(usuarioId)

    if (!usuarioConfirmado){
        return res.status(400).json({error : 'Usuario no encontrado'})
    }

    const maximoDeReservas = db.prepare(`SELECT COUNT(*) AS total FROM reservas WHERE usuarioId = ? AND fecha = date('now')`).get(usuarioId)

    if (maximoDeReservas.total >= 2){
        return res.status(403).json ({error: 'No puede realizar más de dos reservaciones al día', maximoDeReservas})
    }

    const cargador = db.prepare('SELECT * FROM cargadores WHERE id = ?').get(cargadorId)

    if (!cargador) {
        return res.status(400).json({ error: 'El cargador solicitado no existe.' })
    }
    
    const reservasMismoCargador = db.prepare('SELECT * FROM reservas WHERE cargadorId = ?').all(cargadorId)

    const haySobreposicion = reservasMismoCargador.some(reserva => {
        const rangoReservaExistente = calcularRangoReserva(reserva.hora, reserva.duracionMinutosNumero)
        return rangoReservaExistente.inicio < rangoHoraNuevaReserva.fin && rangoHoraNuevaReserva.inicio < rangoReservaExistente.fin
    })

    if (haySobreposicion) {
        return res.status(409).json({ error: 'El cargador ya está reservado en ese horario, revise la disponibilidad de los cargadores.' })
    }

    const fechaHoy = new Date().toISOString().split('T')[0]

    const resultado = db.prepare('INSERT INTO reservas (cargadorId, hora, fecha, duracionMinutos, usuarioId) VALUES (?, ?, ?, ?, ?)').run(cargadorId, hora, fechaHoy, duracionMinutos, usuarioId)

    const nuevaReserva = {
        id: resultado.lastInsertRowid,
        cargadorId,
        hora,
        fecha: fechaHoy,
        duracionMinutosNumero,
        usuarioId,
    }

    res.status(201).json({ mensaje: 'Reserva confirmada', reserva: nuevaReserva })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    const { usuarioId } = req.query

    const reserva = db.prepare('SELECT * FROM reservas WHERE id = ?').get(id)

    if (!reserva) {
        return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    if (reserva.usuarioId !== parseInt(usuarioId)) {
        return res.status(403).json({ error: 'No tiene permiso para eliminar esta reserva' })
    }

    db.prepare('DELETE FROM reservas WHERE id = ?').run(id)

    res.json({ mensaje: 'Reserva eliminada correctamente' })
})

export default router