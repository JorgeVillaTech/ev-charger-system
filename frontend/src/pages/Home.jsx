import { useState, useRef, useEffect } from 'react'
import './Home.css'

function Home() {
    const [usuario] = useState(() => {
        const datosGuardados = localStorage.getItem('usuario')
        return datosGuardados ? JSON.parse(datosGuardados) : null
    })

// Mis reservas
const dialogoMisReservasRef = useRef(null)
const [misReservas, setMisReservas] = useState([])

async function abrirDialogoMisReservas() {
    const response = await fetch(`http://localhost:3001/reservas/usuario/${usuario?.id}/recientes`)
    const datos = await response.json()
    setMisReservas(datos)
    dialogoMisReservasRef.current.showModal()
}

// Consultar cargadores disponibles
const dialogoDisponiblesRef = useRef(null)
const [hora, setHora] = useState('06:00')
const [minutos, setMinutos] = useState('30')
const [cargadoresDisponibles, setCargadoresDisponibles] = useState([])

function abrirDialogoDisponibles() {
    dialogoDisponiblesRef.current.showModal()
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
const [reservaConfirmada, setReservaConfirmada] = useState(null)

async function abrirDialogoHacerReserva() {
    await cargarCargadores()
    dialogReservaCargadorRef.current.showModal()
}

async function cargarCargadores() {
    const response = await fetch(`http://localhost:3001/cargadores`)
    const datos = await response.json()
    setCargadores(datos)
}

// Mostrar dialog con información al realizar una reserva
const dialogReservaExitosaRef = useRef(null)
async function abrirDialogReservaExitosa(){
    dialogReservaCargadorRef.current.close()
    dialogReservaExitosaRef.current.showModal()
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
        setReservaConfirmada({...datos.reserva, nombreUsuario: usuario?.nombre})
        abrirDialogReservaExitosa()
    } else {
        console.log(datos.error)
    }
}

// Eliminar reserva
const dialogoEliminarReservaRef = useRef(null)
const [reservasUsuario, setReservasUsuario] = useState([])
const [idReservaEliminar, setIdReservaEliminar] = useState('')
const [reservaEliminada, setReservaEliminada] = useState(null)

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

const dialogoReservaEliminada = useRef(null)
async function abrirDialogoReservaEliminada(){
    dialogoEliminarReservaRef.current.close()
    dialogoReservaEliminada.current.showModal()
}

async function eliminarReserva() {
    if (!idReservaEliminar) {
        console.log('No hay ninguna reserva seleccionada para eliminar')
        return
    }

    const reservaABorrar = reservasUsuario.find(reserva => reserva.id === idReservaEliminar || reserva.id === parseInt(idReservaEliminar))


    const response = await fetch(`http://localhost:3001/reservas/${idReservaEliminar}?usuarioId=${usuario?.id}`, {
        method: 'DELETE',
    })
    const datos = await response.json()
    if (response.ok) {
        setReservaEliminada(reservaABorrar)
        abrirDialogoReservaEliminada()
    } else {
        console.log(datos.error)
    }
}


// Reglas de uso del Home para ver cargadores disponible y ver, registrar y eliminar reservas, 
const dialogoReglasUsoRef = useRef(null)

async function abrirDialogoReglasUso(){
    dialogoReglasUsoRef.current.showModal()
}

// Tema oscuro/claro
const [temaOscuro, setTemaOscuro] = useState(() => {
    return localStorage.getItem('tema') === 'oscuro'
})

useEffect(() => {
    document.documentElement.setAttribute('data-theme', temaOscuro ? 'oscuro' : 'claro')
}, [])

function alternarTema() {
    const nuevoTema = !temaOscuro
    setTemaOscuro(nuevoTema)
    document.documentElement.setAttribute('data-theme', nuevoTema ? 'oscuro' : 'claro')
    localStorage.setItem('tema', nuevoTema ? 'oscuro' : 'claro')
}


// Elemento JSX
return (
    
    <div className="home-container">

        <div className="home-header">
            
            <button className="boton-tema" onClick={alternarTema}>
                {temaOscuro ? '🌙' : '🔅'}
            </button>
        </div>

        <h1>EV Charger</h1>
        <h2>Bienvenido(a), {usuario?.nombre}</h2>

        <div className="opciones-home">
            <button onClick={abrirDialogoMisReservas}>Ver mis reservas</button>
            <button onClick={abrirDialogoDisponibles}>Ver cargadores disponibles</button>
            <button onClick={abrirDialogoHacerReserva}>Reservar cargador</button>
            <button onClick={abrirDialogoEliminarReserva}>Eliminar reserva</button>
            <button onClick={abrirDialogoReglasUso}>¿Cómo usar la aplicación de reservas?</button>
        </div>

    <dialog ref={dialogoMisReservasRef}>
        <p>Reservas realizadas en los últimos tres días</p>
        <ul>
            {misReservas.map(reserva => (
                <li key={reserva.id}>Cargador reservado: {reserva.cargadorId} | Hora de la reserva: {reserva.hora} | Minutos de la reserva: {reserva.duracionMinutosNumero} | Fecha de la reserva {reserva.fecha}</li>
            ))}
        </ul>

        <button onClick={() => dialogoMisReservasRef.current.close()}>Cerrar</button>

    </dialog>

    <dialog ref={dialogoDisponiblesRef}>
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

        <button onClick={() => dialogoDisponiblesRef.current.close()}>Cerrar</button>
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

        <button onClick={() => dialogReservaCargadorRef.current.close()}>Cerrar</button>

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

        <button onClick={() => dialogoEliminarReservaRef.current.close()}>Cerrar</button>

    </dialog>

    <dialog ref={dialogoReglasUsoRef} className="reglasUso">
        <div>
            <ul>
                <li>Ver mis reservas: muestra las reservas realizadas por el usuario en el día actual y los dos días previos. Se muestra el id de la reserva, la hora que reservó, los minutos de la reserva y la fecha correspondiente.</li>

                <li>Ver cargadores disponibles: permite consultar qué cargadores están libres en una hora y duración específicas. Se selecciona la hora deseada y la duración (entre 30 y 180 minutos), y se muestra el listado de cargadores sin conflicto de horario en ese rango.</li>

                <li>Reservar cargador: permite crear una nueva reserva. Se elige el cargador, la hora de inicio y la duración (mínimo 30 minutos, máximo 180). No se permite reservar un cargador si su horario se traslapa con otra reserva ya existente para ese mismo cargador.</li>

                <li>Eliminar reserva: permite cancelar una reserva activa propia. Solo se muestran y se pueden eliminar las reservas realizadas por el usuario que inició sesión; no es posible cancelar reservas de otros usuarios.</li>
            </ul>

            <button onClick={() => dialogoReglasUsoRef.current.close()}>Cerrar</button>

        </div>
    </dialog>

    <div className="redes-sociales">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷</a>
        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">🎵</a>
        <a href="#" target="_blank" rel="noopener noreferrer">🌐</a>
    </div>

<dialog ref={dialogReservaExitosaRef}>
    <div>
        <h3>Reserva confirmada</h3>
        <p>ID reserva: {reservaConfirmada?.id}</p>
        <p>ID usuario: {reservaConfirmada?.usuarioId}</p>
        <p>Nombre usuario: {reservaConfirmada?.nombreUsuario}</p>
        <p>Fecha: {reservaConfirmada?.fecha}</p>
        <p>Cargador reservado: {reservaConfirmada?.cargadorId}</p>
        <p>Hora de la reserva: {reservaConfirmada?.hora}</p>
        <p>Minutos de la reserva: {reservaConfirmada?.duracionMinutosNumero}</p>

        <button onClick={() => dialogReservaExitosaRef.current.close()}>Cerrar</button>
    </div>
</dialog>


<dialog ref={dialogoReservaEliminada}>
    <div>
        <h3>Reserva eliminada</h3>
        <p>ID reserva: {reservaEliminada?.id}</p>
        <p>Fecha: {reservaEliminada?.fecha}</p>
        <p>Cargador reservado: {reservaEliminada?.cargadorId}</p>
        <p>Hora de la reserva: {reservaEliminada?.hora}</p>
        <p>Minutos de la reserva: {reservaEliminada?.duracionMinutosNumero}</p>

        <button onClick={() => dialogoReservaEliminada.current.close()}>Cerrar</button>
    </div>
</dialog>

    </div>    
    )
}


export default Home