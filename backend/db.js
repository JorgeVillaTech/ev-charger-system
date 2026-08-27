import Database from 'better-sqlite3'

const db = new Database('mycharger.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS cargadores (
    id TEXT PRIMARY KEY
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuarioId INTEGER NOT NULL,
    cargadorId TEXT NOT NULL,
    hora TEXT NOT NULL,
    fecha TEXT NOT NULL,
    duracionMinutos INTEGER NOT NULL,
    FOREIGN KEY (cargadorId) REFERENCES cargadores(id),
    FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
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
    INSERT OR IGNORE INTO cargadores (id) VALUES (?)
`)

const cargadoresIniciales = [
    { id: 'A1' },
    { id: 'A2' },
    { id: 'A3' },
]

cargadoresIniciales.forEach(cargador => {
    insertarCargador.run(cargador.id)
})

export default db