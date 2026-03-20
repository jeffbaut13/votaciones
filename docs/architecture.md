# Arquitectura

## Decision principal

Se usa una arquitectura modular separada por dominio y capa:

- Frontend orientado a UI, rutas, servicios y estado.
- Backend orientado a casos de uso y adaptadores externos.

## Contratos iniciales

- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`
- `POST /api/votes`
- `GET /api/votes/summary`
- `GET /api/votes/records`

## Persistencia

La persistencia queda abstraida en un repositorio de votos. Ahora usa memoria para acelerar el scaffold y luego puede migrarse a Firebase sin romper controladores ni servicios.
