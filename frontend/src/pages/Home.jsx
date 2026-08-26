import { useState, useRef } from 'react'
import './Home.css'

function Home() {
    const [usuario] = useState(() => {
        const datosGuardados = localStorage.getItem('usuario')
        return datosGuardados ? JSON.parse(datosGuardados) : null
    })

// Consultar cargadores disponibles
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

// Reservar cargador
const dialogReservaCargadorRef = useRef(null)
const [idCargador, setIdCargador] = useState('A1')
const [horaReserva, setHoraReserva] = useState('06:00')
const [minutosReserva, setMinutosReserva] = useState('30')
const [cargadores, setCargadores] = useState([])

async function abrirDialogoHacerReserva() {
    await cargarCargadores()
    dialogReservaCargadorRef.current.showModal()
}

async function cargarCargadores() {
    const response = await fetch(`http://localhost:3001/cargadores`)
    const datos = await response.json()
    setCargadores(datos)
}

async function reservarCargador() {
    const response = await fetch('http://localhost:3001/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cargadorId: idCargador,
            hora: horaReserva,
            duracionMinutos: minutosReserva,
            usuarioId: usuario?.id,
        }),
    })
    const datos = await response.json()
    if (response.ok) {
        dialogReservaCargadorRef.current.close()
        // Mostrar dialog con la información de la reserva y permitir cerrar
    } else {
        console.log(datos.error)
    }
}

// Eliminar reserva
const dialogoEliminarReservaRef = useRef(null)
const [reservasUsuario, setReservasUsuario] = useState([])
const [idReservaEliminar, setIdReservaEliminar] = useState('')

async function abrirDialogoEliminarReserva() {
    await extraerReservasUsuario()
    dialogoEliminarReservaRef.current.showModal()
}
// Función para desplegar sólo las reservas asociadas al usuario
async function extraerReservasUsuario() {
    const response = await fetch(`http://localhost:3001/reservas/usuario/${usuario?.id}`)
    const datos = await response.json()
    setReservasUsuario(datos)
    if (datos.length > 0) {
        setIdReservaEliminar(datos[0].id)
    }
}

async function eliminarReserva() {
    if (!idReservaEliminar) {
        console.log('No hay ninguna reserva seleccionada para eliminar')
        return
    }

    const response = await fetch(`http://localhost:3001/reservas/${idReservaEliminar}`, {
        method: 'DELETE',
    })
    const datos = await response.json()
    if (response.ok) {
        dialogoEliminarReservaRef.current.close()
    } else {
        console.log(datos.error)
    }
}

return (
    <div className="home-container">
        <h1>EV Charger</h1>
        <h2>Bienvenido(a), {usuario?.nombre}</h2>

        <div className="opciones-home">
            <button onClick={abrirDialogoDisponibles}>Ver cargadores disponibles</button>
            <button onClick={abrirDialogoHacerReserva}>Reservar cargador</button>
            <button onClick={abrirDialogoEliminarReserva}>Eliminar reserva</button>
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



    <dialog ref={dialogReservaCargadorRef}>
        
        <h3>Reservar Cargador</h3>
        <label>Id Cargador</label>

        <select value={idCargador} onChange={(e) => setIdCargador(e.target.value)}>
            {cargadores.map(cargador => (
                <option key={cargador.id} value={cargador.id}>{cargador.id}</option>
            ))}
        </select>

        <label>Hora:</label>
        <input type="time" value={horaReserva} onChange={(e) => setHoraReserva(e.target.value)} />

        <label>Duración (minutos):</label>
        <select value={minutosReserva} onChange={(e) => setMinutosReserva(e.target.value)}>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="75">75</option>
            <option value="90">90</option>
            <option value="120">120</option>
            <option value="150">150</option>
            <option value="180">180</option>
        </select>

        <button onClick={reservarCargador}>Reservar Cargador</button>

    </dialog>



    <dialog ref={dialogoEliminarReservaRef}>
        <div>
            <h3>Eliminar reserva</h3>
            <h5>ID usuario: {usuario?.id}</h5>
        </div>

        <select value={idReservaEliminar} onChange={(e) => setIdReservaEliminar(e.target.value)}>
            {reservasUsuario.map(reserva => (
                <option key={reserva.id} value={reserva.id}>{reserva.id}</option>
            ))}
        </select>

        <button onClick={eliminarReserva}>Eliminar Reserva</button>

    </dialog>
    </div>
    )
}


export default Home