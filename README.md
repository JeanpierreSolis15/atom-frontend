# Aplicación Kanban - Angular 17

Una aplicación completa de gestión de tareas con tablero Kanban, construida con Angular 17 y Angular Material.

## 🚀 Características

### Autenticación
- **Login/Registro**: Sistema completo de autenticación
- **Guards**: Protección de rutas con guards de autenticación
- **Interceptors**: Manejo automático de tokens JWT
- **Persistencia**: Almacenamiento local de sesión

### Gestión de Tareas
- **Tablero Kanban**: Vista de tareas organizadas por estado
- **Drag & Drop**: Arrastrar y soltar tareas entre columnas
- **CRUD Completo**: Crear, leer, actualizar y eliminar tareas
- **Prioridades**: Sistema de prioridades (Baja, Media, Alta, Urgente)
- **Fechas de vencimiento**: Gestión de fechas límite
- **Asignación**: Asignar tareas a usuarios

### Arquitectura
- **Arquitectura Hexagonal**: Separación clara de capas
- **Principios SOLID**: Código limpio y mantenible
- **Lazy Loading**: Carga diferida de módulos
- **Standalone Components**: Componentes independientes
- **Observables**: Manejo reactivo de datos

## 🛠️ Tecnologías

- **Angular 17**: Framework principal
- **Angular Material**: Componentes UI
- **Angular CDK**: Drag & Drop y utilidades
- **RxJS**: Programación reactiva
- **TypeScript**: Tipado estático
- **SCSS**: Estilos avanzados

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Capa de infraestructura
│   │   ├── guards/             # Guards de autenticación
│   │   ├── interceptors/       # Interceptores HTTP
│   │   ├── models/             # Modelos de dominio
│   │   ├── services/           # Servicios de aplicación
│   │   └── utils/              # Utilidades
│   ├── shared/                 # Componentes compartidos
│   │   ├── components/         # Componentes reutilizables
│   │   ├── directives/         # Directivas personalizadas
│   │   ├── interfaces/         # Interfaces TypeScript
│   │   └── pipes/              # Pipes personalizados
│   ├── features/               # Módulos de características
│   │   ├── auth/               # Módulo de autenticación
│   │   │   ├── login/          # Componente de login
│   │   │   └── register/       # Componente de registro
│   │   └── tasks/              # Módulo de tareas
│   │       ├── components/     # Componentes de tareas
│   │       ├── kanban/         # Tablero Kanban
│   │       ├── models/         # Modelos de tareas
│   │       └── services/       # Servicios de tareas
│   ├── app.component.ts        # Componente principal
│   ├── app.config.ts           # Configuración de la app
│   └── app.routes.ts           # Rutas principales
├── assets/                     # Recursos estáticos
│   └── styles/                 # Estilos globales
└── environments/               # Configuraciones de entorno
```

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd atom-fe-challenge-template-ng-17
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Editar `src/environments/environment.ts`
   - Configurar la URL de la API

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

5. **Construir para producción**
   ```bash
   npm run build
   ```

## 📋 Uso

### Autenticación
1. Navegar a `/auth/login` o `/auth/register`
2. Completar el formulario correspondiente
3. Al autenticarse, serás redirigido al tablero Kanban

### Gestión de Tareas
1. **Crear tarea**: Hacer clic en "Nueva Tarea" en la barra superior
2. **Editar tarea**: Hacer clic en el menú de la tarjeta → "Editar"
3. **Eliminar tarea**: Hacer clic en el menú de la tarjeta → "Eliminar"
4. **Mover tarea**: Arrastrar y soltar entre columnas

### Estados de Tareas
- **Por Hacer**: Tareas pendientes
- **En Progreso**: Tareas en desarrollo
- **Completado**: Tareas finalizadas

## 🔧 Configuración

### Variables de Entorno

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000/api"  // URL de tu API
};
```

### Estilos

Los estilos están organizados en:
- `src/styles.scss`: Estilos globales
- `src/assets/styles/`: Estilos específicos por componente
- Componentes individuales: Estilos encapsulados

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests e2e
npm run e2e
```

## 📦 Build

```bash
# Build de desarrollo
npm run build

# Build de producción
npm run build --configuration production
```

## 🚀 Despliegue

1. **Construir la aplicación**
   ```bash
   npm run build --configuration production
   ```

2. **Servir archivos estáticos**
   - Los archivos se generan en `dist/`
   - Servir con cualquier servidor web estático

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros
- **Guards de ruta**: Protección de páginas
- **Interceptores HTTP**: Manejo automático de tokens
- **Validación de formularios**: Validación del lado cliente

## 📱 Responsive Design

La aplicación es completamente responsive y funciona en:
- Desktop
- Tablet
- Mobile

## 🎨 Temas

La aplicación usa Angular Material con el tema "indigo-pink" por defecto. Puedes personalizar los colores editando los archivos de estilos.

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisar la documentación
2. Buscar en issues existentes
3. Crear un nuevo issue con detalles del problema

## 🔄 Changelog

### v1.0.0
- ✅ Sistema de autenticación completo
- ✅ Tablero Kanban funcional
- ✅ Drag & Drop de tareas
- ✅ CRUD de tareas
- ✅ Arquitectura hexagonal
- ✅ Angular Material UI
- ✅ Responsive design
