import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [contrasena, setContrasena] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
        console.log('Email:', email)
        console.log('Contraseña:', contrasena)
    }

    return (
        <div className="login-container">
        <h1>EV Charger</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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