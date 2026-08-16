import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ForgotPassword.css'

function ForgotPassword() {

    const [email, setEmail] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
        console.log('Email:', email)
    }

    return (
        
        <div className="forgot-password-container">
        <h1>EV Charger</h1>
        <h2>Recuperar contraseña</h2>

        <p>Ingrese su correo electrónico y le enviaremos un enlace para restablecer su contraseña.</p>

        <form onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit">Enviar enlace</button>
        </form>

        <Link to="/login">Volver a iniciar sesión</Link>
        </div>
    )
}

export default ForgotPassword