import { useState, useEffect } from 'react'

function useTema() {
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

    return { temaOscuro, alternarTema }
}

export default useTema