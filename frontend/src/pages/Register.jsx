import { useState} from 'react'
import useTema from '../hooks/useTema'
import { Link } from 'react-router-dom'
import './Register.css'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [email, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [confirmarContrasena, setConfirmarContrasena] = useState('')
    const [nombreCompleto, setNombreCompleto] = useState('')
    const [edad, setEdad] = useState('')
    const [marcaVehiculo, setMarcaVehiculo] = useState('')
    const [modeloVehiculo, setModeloVehiculo] = useState('')
    const [placaVehiculo, setPlacaVehiculo] = useState('')
    const [errorConfirmacion, setErrorConfirmacion] = useState('')
    const [errorRegistro, setErrorRegistro] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

    if (contrasena !== confirmarContrasena) {
        setErrorConfirmacion('Las contraseñas ingresadas no coinciden')
        return
    }

    const response = await fetch('http://localhost:3001/usuarios/registro', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        nombre: nombreCompleto,
        email,
        password: contrasena,
        edad,
        marcaVehiculo,
        modeloVehiculo,
        placaVehiculo,
        }),
    })

    const datos = await response.json()
    if (response.ok){
        navigate('/login')
    } else {
        setErrorRegistro(datos.error)
    }
}

    const {temaOscuro, alternarTema} = useTema()

    return (
        <div className="register-container">

        <button className="boton-cambioTema" onClick={alternarTema}>
            {temaOscuro ? '🌙' : '🔅'}
        </button>

        <h1>EV Charger</h1>
        <h2>Registro de usuario</h2>

        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setUsuario(e.target.value)}
            />
            <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            />
            <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            />
            {errorConfirmacion && <p>{errorConfirmacion}</p>}
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
            {errorRegistro && <p>{errorRegistro}</p>}
            <button type="submit">Registrarme</button>
        </form>

        <p>¿Ya tiene una cuenta? </p>
        <Link to="/login">Inicie sesión aquí</Link>
        </div>
    )
}

export default Register