# 🗳️ Votaciones de Logo - Campaña Publicitaria

Una aplicación web moderna para realizar votaciones de logos de campañas publicitarias con autenticación segura mediante OTP (One-Time Password).

## 📋 Descripción

Esta plataforma permite que los usuarios voten por su logo favorito para una campaña publicitaria. Implementa un sistema de autenticación robusto basado en OTP enviado por SMS, garantizando que cada voto sea validado y único.

**Características principales:**
- 🔐 Autenticación segura mediante OTP vía SMS
- 🎨 Interfaz moderna y responsiva con Vite + React
- 📱 Diseño optimizado para dispositivos móviles y desktop
- ⚡ Backend rápido basado en Node.js
- 🔥 Integración con Firebase para datos en tiempo real
- 📞 Integración con Twilio para envío de OTP

## 🛠️ Stack tecnológico

### Frontend
- **Vite** - Build tool ultrarrápido
- **React 18** - Librería UI
- **Tailwind CSS** - Estilos utilitarios
- **Firebase SDK** - Comunicación con base de datos

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Firebase Admin SDK** - Gestión de base de datos
- **Twilio API** - Envío de SMS/OTP

## 📁 Estructura del proyecto

```
votaciones/
├── frontend/                 # Aplicación React con Vite
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios API
│   │   ├── store/           # Estado global (Zustand)
│   │   └── hooks/           # Custom hooks
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── services/        # Servicios (OTP, SMS, votación)
│   │   ├── routes/          # Definición de rutas
│   │   ├── middlewares/      # Middlewares personalizados
│   │   └── config/          # Configuración
│   └── package.json
│
└── docs/                     # Documentación del proyecto
```

## 🚀 Cómo empezar

### Requisitos previos
- Node.js v16+
- npm o pnpm
- Cuenta de Firebase
- Cuenta de Twilio

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/jeffbaut13/votaciones.git
cd votaciones
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de Firebase y Twilio
npm run dev
```

3. **Configurar Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con tu configuración de Firebase
npm run dev
```

## 🔐 Variables de entorno

### Backend (.env)
```
FIREBASE_PROJECT_ID=tu_proyecto
FIREBASE_PRIVATE_KEY=tu_clave_privada
FIREBASE_CLIENT_EMAIL=tu_email
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=tu_numero_twilio
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_API_URL=http://localhost:3000
```

## 🔄 Flujo de autenticación

1. Usuario ingresa su número telefónico
2. Sistema valida y envía OTP vía SMS (Twilio)
3. Usuario ingresa el código OTP
4. Sistema verifica y autentica al usuario
5. Usuario puede proceder a votar

## 📊 Flujo de votación

1. Usuario autenticado elige su logo favorito
2. Voto se registra en Firebase
3. Contador de votos se actualiza en tiempo real
4. Pantalla de confirmación de voto

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📧 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Estado del proyecto:** ✅ En desarrollo activo
