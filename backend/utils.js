export function horaAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number)
    return horas * 60 + minutos
}

export function calcularRangoReserva(hora, duracionMinutos) {
    const inicio = horaAMinutos(hora)
    const fin = inicio + duracionMinutos
    return { inicio, fin }
}