# Underground

Red social multi-tenant para lugares nocturnos (venues) y bandas musicales.

## Estructura del repositorio

```
/
├── docker-compose.yml       # Postgres+PostGIS, MinIO, Redis, backend, frontend
├── infra/postgres/init/     # Scripts de inicialización de Postgres (extensiones)
├── backend/                 # API NestJS + TypeORM
├── frontend/                # Sitio web (React + Vite)
└── mobile/                  # App React Native + Expo
```

## Requisitos

- Docker y Docker Compose
- (Solo si querés correr algo suelto sin Docker) Node.js 20+

## Levantar todo con un solo comando

```bash
docker compose up -d --build
```

La primera vez tarda unos minutos (descarga imágenes y compila backend + frontend). Esto levanta:

| Servicio | Puerto | Detalle |
|---|---|---|
| **Sitio web** | **8080** | **La página, lista para abrir en el navegador** |
| API backend | 3000 | `http://localhost:3000/api/v1` |
| PostgreSQL 15 (PostGIS) | 5432 | DB `underground_db`, user `postgres` |
| MinIO API | 9000 | S3-compatible object storage |
| MinIO Console | 9001 | http://localhost:9001 |
| Redis | 6379 | Colas (Bull) y caché |

Abrí el puerto **8080** (en Codespaces: pestaña "PUERTOS" → ícono de mundo junto al 8080) y ya tenés la web funcionando — login, feed, crear tu lugar, publicar.

Para cargar datos base (regiones, planes, un superadmin) una vez que los contenedores están arriba:

```bash
docker compose exec backend npm run seed:run
```

Para bajar todo: `docker compose down` (agregá `-v` si también querés borrar los datos de Postgres/MinIO).

## Desarrollo (sin Docker para el código que estás tocando)

Si preferís iterar más rápido sobre el backend o el frontend sin reconstruir la imagen cada vez, dejá **solo** la infraestructura en Docker y corré el código a mano:

```bash
docker compose up -d postgres redis minio
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api/v1`.

> El archivo `.env` se genera solo (con `npm install` / `npm run start:dev`) a partir de `.env.example` si no existe todavía, usando los mismos valores por defecto que `docker-compose.yml`. No hace falta copiarlo a mano. Si por algún motivo `.env.example` no llegó a subirse al repo (pasa al arrastrar carpetas desde la web de GitHub, que a veces omite archivos que empiezan con punto), el script `backend/scripts/ensure-env.js` genera un `.env` de todos modos con esos mismos valores por defecto.

En desarrollo, `DB_SYNCHRONIZE=true` sincroniza el esquema automáticamente a partir de las entidades TypeORM. Para producción, generar y correr migraciones:

```bash
npm run migration:generate -- src/database/migrations/Init
npm run migration:run
```

### Semillas (seeds)

Crea regiones (`lp`, `caba`), planes de suscripción (`Free`, `Premium`) y un usuario superadmin (`admin@underground.dev` / `ChangeMe123!`):

```bash
npm run seed:run
```

### Frontend (web)

```bash
cd frontend
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Como no hay nginx haciendo de proxy en este modo, editá `frontend/.env` y poné la URL completa del backend:
```
VITE_API_URL=http://localhost:3000/api/v1
```

## Mobile (React Native + Expo)

```bash
cd mobile
npm install
npm run start
```

Se abre el Metro Bundler con un QR: escaneálo con la app **Expo Go** (Android/iOS) para probar la app en tu celular, o apretá `w` para abrirla en el navegador.

> Igual que en el backend, el `.env` se auto-genera a partir de `.env.example` (variable `EXPO_PUBLIC_API_URL`, que apunta a `http://localhost:3000/api/v1` por defecto).
>
> **Importante si el backend corre en un Codespace**: `localhost` no te va a andar desde el celular. Cambiá `EXPO_PUBLIC_API_URL` en `mobile/.env` por la URL pública del Codespace, por ejemplo:
> ```
> EXPO_PUBLIC_API_URL=https://tu-codespace-3000.app.github.dev/api/v1
> ```
> y reiniciá `npm run start`.

### Pantallas incluidas (mobile y web)

- **Auth**: login y registro (JWT + refresh token).
- **Feed**: lista paginada de publicaciones de todos los venues/bandas, con paginación/infinite scroll.
- **Perfil de Venue**: info del lugar + sus publicaciones (público, sin login).
- **Mis lugares / Crear-editar lugar**: cualquier usuario puede dar de alta su bar o local — al crearlo, se convierte automáticamente en administrador de ese venue.
- **Crear publicación**: para admins de venue (elige uno de sus lugares, tipo de post, título, contenido, fecha, precio, link de entradas).
- **Mi perfil**: datos del usuario logueado y cerrar sesión.

## Módulos del backend
- `auth`: registro/login por email+password, login con Google y Facebook (OAuth2), JWT access + refresh tokens.
- `users`: perfil de usuario, roles (`user`, `venue_admin`, `band_admin`, `superadmin`), géneros favoritos.
- `regions`: localidades/tenants (ej. La Plata, CABA).
- `venues`: bares/locales nocturnos, con geolocalización, plan de suscripción y datos de Mercado Pago.
- `bands`: bandas musicales, redes sociales, videos de YouTube embebidos.
- `posts`: publicaciones de eventos, promos, merch y noticias asociadas a un venue (y opcionalmente a una banda).
- `notifications`: notificaciones push vía Firebase Cloud Messaging (FCM).
- `uploads`: subida de imágenes a MinIO (`POST /uploads`, autenticado) y su servido público (`GET /media/:key`) — el backend actúa de intermediario, así el bucket de MinIO no necesita ser público y la URL devuelta funciona en cualquier entorno (localhost, Codespaces, etc.) sin configuración extra.
