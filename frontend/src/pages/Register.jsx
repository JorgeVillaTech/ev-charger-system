import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'

function Register() {
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [nombreCompleto, setNombreCompleto] = useState('')
    const [edad, setEdad] = useState('')
    const [marcaVehiculo, setMarcaVehiculo] = useState('')
    const [modeloVehiculo, setModeloVehiculo] = useState('')
    const [placaVehiculo, setPlacaVehiculo] = useState('')
    const [puesto, setPuesto] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
        console.log('Usuario:', usuario)
        console.log('Contraseña:', contrasena)
        console.log('Nombre completo:', nombreCompleto)
        console.log('Edad:', edad)
        console.log('Marca del vehículo:', marcaVehiculo)
        console.log('Modelo del vehículo:', modeloVehiculo)
        console.log('Placa del vehículo:', placaVehiculo)
        console.log('Puesto:', puesto)
    }

    return (
        <div className="register-container">
        <h1>EV Charger</h1>
        <h2>Registro de usuario</h2>

        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            />
            <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            />
            <input
            type="text"
            placeholder="Nombre completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            />
            <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            />
            <input
            type="text"
            placeholder="Marca del vehículo"
            value={marcaVehiculo}
            onChange={(e) => setMarcaVehiculo(e.target.value)}
            />
            <input
            type="text"
            placeholder="Modelo del vehículo"
            value={modeloVehiculo}
            onChange={(e) => setModeloVehiculo(e.target.value)}
            />
            <input
            type="text"
            placeholder="Placa del vehículo"
            value={placaVehiculo}
            onChange={(e) => setPlacaVehiculo(e.target.value)}
            />
            <input
            type="text"
            placeholder="Puesto"
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            />

            <button type="submit">Registrarme</button>
        </form>

        <p>¿Ya tiene una cuenta? </p>
        <Link to="/login">Inicie sesión aquí</Link>
        </div>
    )
}

export default Register