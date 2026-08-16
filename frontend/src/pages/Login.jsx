import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
    const [usuario, setUsuario] = useState('')
    const [contrasena, setContrasena] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
        console.log('Usuario:', usuario)
        console.log('Contraseña:', contrasena)
    }

    return (
        <div className="login-container">
        <h1>EV Charger</h1>
        <h2>Iniciar sesión</h2>

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

            <button type="submit">Ingresar</button>
        </form>

        <Link to="/olvide-password">¿Olvidó su contraseña?</Link>
        <button>Soporte / Ayuda</button>

        <p>¿No tiene una cuenta? </p>
        <Link to="/registro">Regístrese aquí</Link>
        </div>
    )
}

export default Login