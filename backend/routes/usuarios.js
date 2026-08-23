import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db.js'

const router = express.Router()

router.post('/registro', async (req, res) => {
    const { nombre, email, password, edad, marcaVehiculo, modeloVehiculo, placaVehiculo } = req.body

    if (!nombre || !email || !password || !edad || !marcaVehiculo || !modeloVehiculo || !placaVehiculo) {
        return res.status(400).json({ error: 'Faltan datos: nombre, email, password, edad, marcaVehiculo, modeloVehiculo y placaVehiculo son obligatorios' })
    }

    // Validar que el email no esté ya registrado
    const usuarioExistente = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)

    if (usuarioExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' })
    }

    // Hash de la contraseña (capa de seguridad)
    const hashedPassword = await bcrypt.hash(password, 10)

    const resultado = db.prepare('INSERT INTO usuarios (nombre, email, password, edad, marcaVehiculo, modeloVehiculo, placaVehiculo) VALUES (?, ?, ?, ?, ?, ?, ?)').run(nombre, email, hashedPassword, edad, marcaVehiculo, modeloVehiculo, placaVehiculo)

    const nuevoUsuario = {
        id: resultado.lastInsertRowid,
        nombre,
        email,
        edad,
        marcaVehiculo,
        modeloVehiculo,
        placaVehiculo
    }

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario })
})

router.post('/login', async (req, res) => {

    const {email, password} = req.body

    const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email)
    
    if(!usuario){
        return res.status(400).json({ error: 'Email o contraseña incorrectos, intente de nuevo.'})
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password)

    if(!passwordCorrecta){
        return res.status(400).json({ error: 'Email o contraseña incorrectos, intente de nuevo.'})
    }

    return res.status(200).json({ mensaje: 'Acceso concedido.'})
})

export default router