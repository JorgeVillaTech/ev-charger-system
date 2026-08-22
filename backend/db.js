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

const insertarCargador = db.prepare(`
    INSERT OR IGNORE INTO cargadores (id, estado) VALUES (?, ?)
`)

const cargadoresIniciales = [
    { id: 'A5', estado: 'disponible' },
    { id: 'A6', estado: 'ocupado' },
    { id: 'B1', estado: 'ocupado' },
    { id: 'C10', estado: 'disponible' },
]

cargadoresIniciales.forEach(cargador => {
    insertarCargador.run(cargador.id, cargador.estado)
})

export default db