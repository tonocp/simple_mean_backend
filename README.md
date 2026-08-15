# simple_mean_backend

Backend básico para stack MEAN (MongoDB, Express.js, Angular, Node.js) con autenticación JWT. Sirve de backend compartido para varios proyectos del portfolio (heroes, gráficas, ...).

## Desarrollo local

Requiere Node 24.15.0 (ver `.nvmrc`) y Docker.

```bash
docker compose up -d   # levanta MongoDB en local (puerto 27017)
npm install
npm run dev             # nodemon, puerto 4000
```

### Variables de entorno (`.env`, ver `.env.example`)

- `PORT` — puerto del servidor.
- `DB_CNN` — cadena de conexión a MongoDB.
- `SECRET_JWT_SEED` — semilla para firmar los tokens JWT.
- `CORS_ORIGIN` — orígenes permitidos. Vacío o `*` permiten cualquier origen; si no, lista separada por comas (p. ej. `https://app-a.netlify.app,https://app-b.netlify.app`).

### Datos de ejemplo

```bash
npm run seed            # siembra heroes y redes sociales si las colecciones están vacías
npm run seed -- --force # reemplaza los documentos sembrados (no toca los creados por usuarios)
```

## Endpoints

Todas las rutas devuelven JSON. Las que no están marcadas como públicas requieren el header `x-token` con un JWT válido (ver `POST /api/auth`).

### Auth

- `POST /api/auth/new` — registro de usuario.
- `POST /api/auth` — login.
- `GET /api/auth/renew` — renovar token (requiere `x-token`).

### Heroes

- `GET /api/heroes/list` — listar héroes.
- `GET /api/heroes/search/:termino` — buscar héroes por nombre (case-insensitive).
- `GET /api/heroes/:id` — obtener un héroe por id.
- `POST /api/heroes/new` — crear héroe.
- `PUT /api/heroes/edit/:id` — actualizar héroe (los héroes del seed no se pueden editar).
- `DELETE /api/heroes/:id` — borrar héroe (los héroes del seed no se pueden borrar).

### Gráficas

- `GET /api/graficas/redes-sociales` — **pública** (sin token). Devuelve la lista de redes sociales con sus seguidores, pensada para alimentar gráficos en un frontend público.
