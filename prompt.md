Actua como un Programador Arquitecto Senior y Tech Lead. Tu responsabilidad inicial NO es improvisar pantallas sueltas ni lógica desordenada, sino diseñar y construir el armazón sólido, estable, mantenible y escalable de una aplicación moderna. Cuando termines la fase de arquitectura y scaffolding, cambia automáticamente tu rol a Programador Senior Full Stack y comienza a desarrollar la lógica base del proyecto respetando la arquitectura definida.

## Idea 
Se creara una web de votaciones donde los usuarios podran votar por opcion A o B, para elegir o un nuevo logo o mantener el viejo
La autenticacion funciona por otp el usuario llega y solo ve un campo el cual es su numero de celular lo digita el sistema verifica si ya voto, si ya voto le sale mensaje de "ya no puedes votar", si no muestra el segundo paso que es digitar un codigo que sera enviado al numero por sms, al digitarlo se autoriza la votacion, y avanza al paso 3 alli escoge A o B y al enviar se confirma votacion y ya no puede votar mas.

## Objetivo general del proyecto
Construir la base arquitectónica de una aplicación web con frontend en Vite + React y un backend ambos en javascript y jsx segun corresponda simple separado, donde:
- El frontend usará:
  - Vite
  - React
  - Tailwind CSS
  - Framer Motion
  - GSAP
  - lucide-react
  - Zustand
  - react-router-dom
- El backend será simple, limpio y desacoplado del frontend, encargado de:
  - Conectarse con Firebase mediante Firebase Admin o la estrategia adecuada del lado servidor
  - Integrarse con Twilio para envío de SMS de autenticación peor el otp lo maneja el backend propiamente
  - Exponer endpoints limpios para que el frontend consuma un formulario de autenticación por SMS  y realice una validacion si ya voto o no.
- Por ahora necesito, la estructura profesional y el armazón completo del proyecto
- Después de completar la arquitectura, debes empezar a desarrollar la lógica base del proyecto como Programador Senior

## Enfoque obligatorio
Debes trabajar en 2 fases obligatorias:

### FASE 1: Arquitectura y armazón
Tu tarea principal aquí es:
1. Definir la arquitectura del proyecto
2. Crear la estructura de carpetas y archivos
3. Instalar y organizar dependencias
4. Configurar rutas, layouts, servicios, stores, helpers y utilidades
5. Preparar una base limpia para escalar
6. Dejar definidos los contratos entre frontend y backend
7. Documentar claramente qué hace cada módulo
8. No sobrecargar con lógica de negocio compleja todavía; primero la base

### FASE 2: Desarrollo inicial como Programador Senior
Cuando termines la FASE 1:
1. Cambia de rol a Programador Senior Full Stack
2. Empieza a implementar la lógica base real del proyecto
3. Desarrolla primero la lógica esencial, no features secundarias
4. Mantén la arquitectura limpia
5. No rompas la separación de responsabilidades

## Reglas de arquitectura
Debes seguir estas reglas estrictamente:

- Prioriza escalabilidad, mantenibilidad y legibilidad
- Usa una estructura profesional, no una estructura improvisada
- No mezcles lógica de UI con lógica de negocio
- No pongas secretos en el frontend
- Toda clave sensible debe ir en variables de entorno
- El frontend y el backend deben estar separados en carpetas distintas
- El código debe quedar listo para crecer sin reestructurar todo después
- Usa nombres de carpetas y archivos coherentes, claros y predecibles
- Evita archivos gigantes
- Divide componentes por responsabilidad
- Prepara una arquitectura pensada para futuras validaciones, guards, middlewares, servicios y escalado
- Usa importaciones limpias y, si aplica, aliases
- Crea una base reutilizable de componentes, hooks, stores, servicios y rutas
- Explica brevemente por qué tomas decisiones importantes de arquitectura

## Stack y decisiones técnicas obligatorias
Debes usar esta base:

### Frontend
- Vite
- React
- Tailwind CSS
- Framer Motion
- GSAP
- lucide-react
- Zustand
- react-router-dom

### Backend (apto para subir a google cloud functions u otro serveless, si se necesita libreria de firebase instalala)
- Node.js
- Express
- Firebase Admin SDK o integración de servidor adecuada
- Twilio
- API REST simple, clara y limpia

## Estructura general obligatoria
Quiero una raíz del proyecto con esta idea:

/project-root
  /frontend
  /backend
  /docs
  README.md

### Frontend
Dentro de `frontend/src` debes contemplar como mínimo una estructura profesional basada en esto:

- components
- helpers
- hooks
- utils
- pages
- routes
- services
- store
- layouts
- assets
- config
- constants
- lib


Puedes expandirla con criterio profesional si realmente mejora la escalabilidad.

### Pages obligatorias
Dentro de `frontend/src/pages` deben existir páginas o módulos base para:

- home → una onepage interactiva
- autenticaciones
- votacion
- registro-de-votaciones

Debes proponer una estructura interna coherente para estas páginas. Por ejemplo, separar vistas, secciones, componentes específicos, formularios y lógica asociada si conviene.

## Requisitos específicos por módulo

### 1. Home
La página Home debe estar pensada como:
- Onepage interactiva
- Visualmente moderna
- Preparada para animaciones con Framer Motion y GSAP
- Estructurada por secciones reutilizables
- Escalable para agregar nuevas secciones sin romper el layout

No hace falta diseñar toda la experiencia final, pero sí dejar la base arquitectónica correcta para una landing/onepage interactiva profesional.

### 2. Autenticaciones
La carpeta/página de autenticaciones debe quedar preparada para que el usuario se autentique unicamente con numero de celular el cual se envia sms con token creado desde backend, y el usuario lo recibe por sms lo tomalo ingresa y el form lo envia al backen para su validacion, con esto ya se autentica:
debe contar con campo de si ya realizo votacion, si se valida votacion no hace envio de otp y envia mensaje al usuario de ya voto y no lo ejecuta otp
- Verificación por SMS
- Formularios desacoplados
- Estados de carga, error y éxito
- Integración posterior con Firebase y backend/Twilio

Debes separar:
- UI del formulario
- validaciones
- servicios
- estado global/local
- flujo de autenticación

### 3. Votación
La carpeta/página de votación debe quedar preparada para:
- primer paso: 
Autenticacion de candidatos
Validar si el usuario ya voto
- Segundo paso 
si no voto autenticar por otp
si ya voto mensaje de "ya voto" finalizar
REGLA:Persistir o registrar la acción luego de autenticar y si no ha votado si recarga le muestra la pagina del paso donde quedo
- Tercer paso
Mostrar opciones de votaciones A o B el voton de registrar voto hace redireccion a registro-de-votaciones con los resultados de A Y B manos con sus resultados


No hace falta la lógica final completa al principio, pero sí un armazón listo para crecer.

### 4. Registro de votaciones
La carpeta/página de registro-de-votaciones debe quedar preparada para:
- Mostrar historial o registros
- Filtrar, listar o consultar información más adelante
- Separar vista, datos y componentes reutilizables

## Zustand
Debes usar Zustand con criterio profesional.
Crea una estrategia clara para stores, por ejemplo:
- auth store persiste si se cae o cambia de pagina luego de autenticacion
- UI store
- voting store

No abuses del estado global. Solo debe ir allí lo que tenga sentido global.

## Backend simple separado
Crea un backend simple pero profesional el cual permita usarse en cloud functions de google firebase.

Debe tener una estructura clara, por ejemplo:
- src/config
- src/routes
- src/controllers
- src/services
- src/middlewares
- src/utils
- src/modules
- src/lib

El backend debe quedar preparado para:
- Integrarse con Firebase del lado servidor
- Integrarse con Twilio para enviar SMS
- Recibir solicitudes desde formularios del frontend
- Exponer endpoints limpios para autenticación por SMS
- Verificar si el usuario ya voto y enviar mensaje de "usuario ya realio votacion" y no ejecutar otp twilio
- Escalar sin reescribir todo

## Flujo backend esperado
Aunque no implementes toda la lógica final de negocio de una vez, debes dejar claramente definido y parcialmente iniciado este flujo:

1. El frontend envía un formulario de autenticación por teléfono
2. El backend recibe la solicitud
3. El backend valida si USUARIO ya voto o prepara verificación
3. SI NO HA VOTADO El backend usa Twilio para enviar SMS
4. El backend valida y prepara verificación
5. El backend se apoya en Firebase según corresponda guardar estado de votacion:"true" por defecto esta false
6. El frontend consume la respuesta y actualiza la UI segun el estado de votacion

Debes separar correctamente:
- rutas
- controladores
- servicios
- configuración
- validaciones
- cliente Twilio
- cliente Firebase Admin

## Routing
Debes configurar `react-router-dom` de forma profesional:
- Rutas centralizadas
- Layout principal
- Posibilidad de rutas públicas y privadas
- Base preparada para guards
- Organización limpia

Rutas mínimas:
- /
- /auth-sms
- /votacion
- /registro-de-votaciones

## Componentes
Define una estrategia de componentes como mínimo para:
- ui
- layout
- sections
- forms
- feedback states
- shared/common

Los componentes deben ser reutilizables, limpios y bien agrupados.

## Animaciones
Usa Framer Motion y GSAP con criterio:
- Framer Motion para transiciones y animaciones declarativas por componente
- GSAP para secuencias más complejas o controladas, especialmente en Home
- No mezclar ambas sin una razón
- La arquitectura debe dejar claro dónde vive la lógica de animación

## Calidad del proyecto
Quiero que dejes preparado:
- ESLint
- estructura limpia
- archivos `.env.example`
- README inicial útil
- comentarios solo donde aporten valor real
- documentación breve de arquitectura en `/docs`

## Entregables obligatorios
Quiero que entregues y/o construyas en este orden:

### Entregable 1
Un resumen breve de la arquitectura elegida y por qué es estable y escalable.

### Entregable 2
El árbol completo de carpetas y archivos propuesto.

### Entregable 3
Explicación corta de la responsabilidad de cada carpeta importante.

### Entregable 4
Scaffolding inicial del frontend y backend.

### Entregable 5
Configuración base de:
- Tailwind
- Router
- Zustand
- Backend Express
- integración base Twilio
- integración base Firebase server/admin

### Entregable 6
Páginas base creadas:
- Home
- Auth
- Votacion
- RegistroDeVotaciones

### Entregable 7
Cambio de rol a Programador Senior Full Stack para comenzar la lógica inicial real del proyecto.

## Qué debe hacer Codex al cambiar a Programador Senior
Cuando termines la arquitectura, debes continuar automáticamente con implementación base de calidad profesional:

1. Crear el layout principal del frontend
2. Crear el sistema base de rutas
3. Crear stores iniciales con Zustand
4. Crear servicios del frontend para auth y votación
5. Crear configuración Firebase cliente
6. Crear endpoints base en backend para SMS auth
7. Crear la integración inicial Twilio
8. Crear la integración inicial Firebase Admin
9. Crear formularios base de autenticación otp 
10. Dejar preparado el flujo frontend → backend → Twilio/Firebase

## Restricciones importantes
- No improvises una arquitectura caótica
- No pongas toda la lógica en `App.jsx`
- No mezcles componentes con servicios
- No metas llamadas HTTP directamente en cualquier componente sin capa de servicio
- No dupliques lógica
- No hardcodees secretos
- No uses una estructura de “todo dentro de pages” sin separación profesional
- No hagas un backend monolítico desordenado
- No me des una respuesta vaga; quiero una propuesta concreta y accionable

## Formato de salida esperado
Trabaja en este formato:

1. Resumen de arquitectura
2. Árbol de carpetas completo
3. Responsabilidad de carpetas
4. Dependencias a instalar
5. Scaffolding inicial recomendado
6. Base del frontend
7. Base del backend
8. Primeros archivos clave a crear
9. Inicio de implementación como Programador Senior

## Decisiones por defecto
Si tienes que elegir sin preguntar:
- Usa javascript y jsx segun corresponda
- Usa nombres de archivos y carpetas en formato claro y consistente
- Usa componentes funcionales
- Usa arquitectura modular
- Usa Express en backend por simplicidad y claridad compatibel con google fuctions de firebase
- Usa aliases para imports si ayuda a la mantenibilidad
- Usa una estructura lista para crecer a producción

## Instrucción final
No te quedes en teoría. Diseña la arquitectura, arma el proyecto base, documenta lo esencial y luego cambia automáticamente al rol de Programador Senior Full Stack para empezar a desarrollar la lógica inicial del proyecto sobre el armazón ya definido.