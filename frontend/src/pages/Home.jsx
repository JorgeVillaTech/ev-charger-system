import { useState, useRef } from 'react'
import './Home.css'

function Home() {
    const [usuario] = useState(() => {
        const datosGuardados = localStorage.getItem('usuario')
        return datosGuardados ? JSON.parse(datosGuardados) : null
    })

const dialogDisponiblesRef = useRef(null)
const [hora, setHora] = useState('06:00')
const [minutos, setMinutos] = useState('30')
const [cargadoresDisponibles, setCargadoresDisponibles] = useState([])

function abrirDialogoDisponibles() {
    dialogDisponiblesRef.current.showModal()
}

async function consultarDisponibilidad() {
    const response = await fetch(`http://localhost:3001/cargadores/disponibles?horaReserva=${hora}&minutosReserva=${minutos}`)
    const datos = await response.json()
    setCargadoresDisponibles(datos.cargadores)
}

return (
    <div className="home-container">
        <h1>EV Charger</h1>
        <h2>Bienvenido(a), {usuario?.nombre}</h2>

        <div className="opciones-home">
            <button onClick={abrirDialogoDisponibles}>Ver cargadores disponibles</button>
            <button>Reservar cargador</button>
            <button>Eliminar reserva</button>
        </div>

    <dialog ref={dialogDisponiblesRef}>
        <h3>Consultar disponibilidad</h3>

        <label>Hora:</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />

        <label>Duración (minutos):</label>
        <select value={minutos} onChange={(e) => setMinutos(e.target.value)}>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="75">75</option>
            <option value="90">90</option>
            <option value="120">120</option>
            <option value="150">150</option>
            <option value="180">180</option>
        </select>

        <button onClick={consultarDisponibilidad}>Consultar</button>

        <ul>
            {cargadoresDisponibles.map(cargador => (
                <li key={cargador.id}>{cargador.id}</li>
            ))}
        </ul>

        <button onClick={() => dialogDisponiblesRef.current.close()}>Cerrar</button>
    </dialog>
    </div>
    )
}

export default Home