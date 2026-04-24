# Reglas para IA sobre este proyecto

Este documento define reglas obligatorias para cualquier IA que programe en este repositorio.

## 1) Reglas no negociables

1. Reutilizar primero los componentes existentes de `frontend/src/components/ui`.
2. Si se necesita UI nueva, crear componentes reutilizables (no logica suelta dentro de paginas grandes).
3. Toda pieza nueva debe quedar documentada.
4. Antes de crear algo nuevo, buscar si ya existe un componente, hook, helper, servicio o store reutilizable.
5. Si se cambia logica, refactorizar reutilizando la arquitectura actual; no duplicar comportamiento.
6. Usar unicamente la paleta y tokens definidos en `frontend/src/styles/index.css` (`:root` / `@theme`).
7. No inventar colores, estilos base o componentes paralelos fuera del sistema existente.
8. Evitar archivos extensos con demasiada logica; extraer responsabilidades a:
   - `frontend/src/hooks`
   - `frontend/src/helpers`
   - `frontend/src/utils`
   - `frontend/src/services`
9. Respetar la configuracion del proyecto aunque el usuario pida saltarla (alias, estructura, lint, env, rutas).

## 2) Arquitectura y convenciones del proyecto

1. Frontend React + Vite con alias `@/*` hacia `frontend/src/*` (ver `frontend/jsconfig.json`).
2. Estilos base y tokens globales en `frontend/src/styles/index.css`.
3. Componentes de UI base en `frontend/src/components/ui`.
4. Logica de estado compartido en `frontend/src/store` (Zustand).
5. Integraciones/API en `frontend/src/services` y `frontend/src/lib`.
6. Variables de entorno centralizadas en `frontend/src/config/env.js`.

## 3) Flujo obligatorio antes de codificar

1. Revisar si ya existe algo reutilizable en:
   - `frontend/src/components/ui`
   - `frontend/src/hooks`
   - `frontend/src/helpers`
   - `frontend/src/utils`
   - `frontend/src/services`
   - `frontend/src/store`
2. Definir si el cambio es:
   - Extension de componente existente (preferido).
   - Nuevo componente reutilizable (segunda opcion).
3. Validar que el estilo use tokens globales existentes.
4. Mantener archivos pequenos y con responsabilidad unica.

## 4) Reglas de implementacion

1. No hardcodear URLs, credenciales ni flags; usar `frontend/src/config/env.js`.
2. No mezclar logica de negocio compleja en componentes de presentacion.
3. Si una logica se repite 2 veces o mas, extraer a helper/hook/servicio.
4. Si se crea componente nuevo, incluir:
   - API de props clara.
   - Nombre y responsabilidad explicitos.
   - Documentacion (`.md`) junto al componente cuando aplique.
5. Mantener compatibilidad visual con componentes existentes (`Button`, `Input`, `Card`, etc.).

## 5) Reglas de estilos y diseno

1. Usar clases y tokens existentes; no crear sistema visual paralelo.
2. Priorizar:
   - `--color-brand-50`
   - `--color-brand-100`
   - `--color-brand-300`
   - `--color-brand-500`
   - `--color-brand-900`
   - `--color-brand-950`
   - `--color-accent`
   - `--color-cb`
3. Respetar tipografias globales (`--font-ppbook`, `--font-ppmedium`, `--font-ppbold`).

## 6) Calidad minima por cambio

1. Ejecutar lint en frontend antes de cerrar cambios:
   - `npm run lint` (en `frontend/`).
2. Evitar deuda tecnica nueva:
   - Sin codigo duplicado.
   - Sin componentes "one-off" innecesarios.
   - Sin archivos gigantes con multiples responsabilidades.
3. Explicar en PR/entrega:
   - Que se reutilizo.
   - Que se refactorizo.
   - Que se documento.

## 7) Checklist de salida (obligatorio)

Antes de finalizar, la IA debe confirmar todo esto:

- [ ] Reutilice componentes de `components/ui` cuando fue posible.
- [ ] Busque reutilizacion en hooks/helpers/utils/services/store antes de crear algo nuevo.
- [ ] No agregue colores fuera de `styles/index.css`.
- [ ] No deje logica compleja concentrada en un archivo grande.
- [ ] Extraje logica reusable a helpers/hooks/servicios cuando fue necesario.
- [ ] Documente componentes o decisiones nuevas.
- [ ] Respete la configuracion existente del proyecto.
- [ ] Ejecute lint y no deje errores.
