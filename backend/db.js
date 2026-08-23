import Database from 'better-sqlite3'

const db = new Database('mycharger.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS cargadores (
    id TEXT PRIMARY KEY,
    estado TEXT NOT NULL
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cargadorId TEXT NOT NULL,
    hora TEXT NOT NULL,
    duracionMinutos INTEGER NOT NULL,
    FOREIGN KEY (cargadorId) REFERENCES cargadores(id)
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    edad INTEGER NOT NULL,
    marcaVehiculo TEXT NOT NULL,
    modeloVehiculo TEXT NOT NULL,
    placaVehiculo TEXT NOT NULL
    )
`)

const insertarCargador = db.prepare(`
    INSERT OR IGNORE INTO cargadores (id, estado) VALUES (?, ?)
`)

const cargadoresIniciales = [
    { id: 'A1', estado: 'disponible' },
    { id: 'A2', estado: 'disponible' },
    { id: 'A3', estado: 'disponible' },
]

cargadoresIniciales.forEach(cargador => {
    insertarCargador.run(cargador.id, cargador.estado)
})

export default db