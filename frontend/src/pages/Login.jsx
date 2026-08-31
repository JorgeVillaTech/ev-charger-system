import useTema from '../hooks/useTema'
import {useState} from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [errorLogin, setErrorLogin] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()

        const response = await fetch('http://localhost:3001/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password: contrasena
            })
        })

        const datos = await response.json()
        if (response.ok){
            localStorage.setItem('usuario', JSON.stringify(datos.usuario))
            navigate('/home')
        } else {
            setErrorLogin(datos.error)
        }
    }

    // Tema oscuro-claro
    const { temaOscuro, alternarTema } = useTema()

    return (

        <div className="login-container">

            <button className="boton-cambioTema" onClick={alternarTema}>
                {temaOscuro ? '🌙' : '🔅'}
            </button>

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
            {errorLogin && <p>{errorLogin}</p>}
            <button type="submit">Ingresar</button>
        </form>

        <p>¿Olvidó su contraseña?</p>
        <Link to="/olvide-password">Restablecer contraseña</Link>

        <p>¿No tiene una cuenta? </p>
        <Link to="/registro">Regístrese aquí</Link>
        </div>
    )
}

export default Login