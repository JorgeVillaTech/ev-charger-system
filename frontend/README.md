# ⚡ MC: My Charger

**Sistema de gestión de reservas para cargadores de vehículos eléctricos**, diseñado para entornos corporativos con alta demanda y capacidad limitada — zonas francas, campus empresariales y estacionamientos con pocos puntos de carga para muchos usuarios.

---

## 🎯 El problema

En espacios de trabajo con decenas o cientos de vehículos eléctricos y solo un puñado de cargadores disponibles, la reserva informal ("dejar una nota en el parabrisas") genera conflictos constantes: usuarios que no saben cuándo un cargador se libera, reservas dobles, y tiempo perdido buscando disponibilidad en tiempo real.

**MC: My Charger** resuelve esto con un sistema centralizado donde cada usuario puede consultar disponibilidad real, reservar con reglas claras, y cancelar sin fricción — evitando traslapes de horario de forma automática, no manual.

---

## ✨ Funcionalidades

- 🔐 **Autenticación real** — registro y login con contraseñas hasheadas (nunca en texto plano)
- 🔍 **Consulta de disponibilidad** — filtra cargadores libres por hora y duración específicas
- 📅 **Reservas con validación inteligente** — el sistema rechaza automáticamente cualquier reserva que se cruce con otra ya existente para el mismo cargador
- ⏰ **Reglas de negocio reales** — horario de operación (6:00 am – 10:30 pm), duración mínima/máxima por reserva, límite de reservas diarias por usuario
- ❌ **Cancelación segura** — cada usuario solo puede cancelar sus propias reservas, verificado en el servidor
- 📋 **Historial de reservas** — consulta rápida de actividad reciente
- 🌗 **Tema claro/oscuro** — con preferencia persistente entre sesiones
- 🛡️ **Rutas protegidas** — las pantallas internas no son accesibles sin sesión activa

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React + Vite, React Router |
| **Backend** | Node.js + Express |
| **Base de datos** | SQLite (better-sqlite3) — relacional, con llaves foráneas |
| **Seguridad** | bcrypt (hash de contraseñas), CORS, validación en frontend y backend |
| **Gestor de paquetes** | pnpm |

---

## 🚀 Cómo correrlo localmente

### 1. Clonar el repositorio
```bash
git clone https://github.com/JorgeVillaTech/ev-charger-system.git
cd ev-charger-system
```

### 2. Levantar el backend
```bash
cd backend
pnpm install
pnpm run dev
```
Corre en `http://localhost:3001`

### 3. Levantar el frontend (en otra terminal)
```bash
cd frontend
pnpm install
pnpm run dev
```
Corre en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
ev-charger-reservas/
├── backend/
│   ├── routes/              # Endpoints organizados por recurso (usuarios, cargadores, reservas)
│   ├── db.js                # Conexión y esquema de SQLite
│   ├── utils.js              # Funciones auxiliares (cálculo de rangos horarios)
│   └── index.js               # Punto de entrada del servidor
│
└── frontend/
    └── src/
        ├── pages/              # Login, Registro, Home, Recuperar contraseña
        ├── components/          # Componentes reutilizables (rutas protegidas)
        └── hooks/                # Custom Hooks (useTema)
```

---

## 🧠 Decisiones técnicas destacadas

- **Algoritmo de traslape de horarios** — compara matemáticamente rangos de tiempo (inicio/fin en minutos) para detectar conflictos entre reservas, sin depender de comparaciones de texto.
- **Autorización a nivel de servidor** — cada operación sensible (cancelar una reserva) verifica en el backend que el usuario solicitante sea realmente el dueño, sin confiar únicamente en lo que el frontend oculta o muestra.
- **Persistencia real con SQLite** — elegida deliberadamente por su simplicidad de despliegue (un solo archivo, sin servidor de base de datos separado que administrar), adecuada para el alcance actual del proyecto.
- **Modelo de datos relacional** — tres tablas conectadas por llaves foráneas (usuarios, cargadores, reservas), reflejando relaciones reales del negocio en vez de datos sueltos.

---

## 🗺️ Roadmap

- [ ] Sistema de notificaciones (aviso antes de que termine/empiece un turno)
- [ ] Panel de administración para gestión de solicitudes de cambio de datos
- [ ] Asistente conversacional integrado para soporte al usuario
- [ ] Mapa visual interactivo de disponibilidad de cargadores

---

## 👤 Autor

**Jorge Luis Villalobos Herrera**
Estudiante de Ingeniería en Software (UNED) en transición profesional hacia desarrollo de software y soporte técnico.

Proyecto construido de principio a fin — desde el diseño de la base de datos hasta la interfaz — como parte de un proceso activo de aprendizaje full-stack.