import express from 'express'

const router = express.Router()

const cargadores = [
    { id: 'A5', estado: 'disponible' },
    { id: 'A6', estado: 'ocupado' },
    { id: 'B1', estado: 'ocupado' },
    { id: 'C10', estado: 'disponible' },
]

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
export { cargadores }