# RIU Frontend - Andrés Ucero

Frontend desarrollado en Angular 20.

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Scripts disponibles](#scripts-disponibles)
- [Testing](#testing)
- [Linting y formateo](#linting-y-formateo)
- [Docker](#docker)
- [Estructura del proyecto](#estructura-del-proyecto)

---

## Descripción

Este proyecto es un frontend desarrollado con Angular 20 que implementa un CRUD de héroes, utilizando una arquitectura orientada a features y buenas prácticas modernas como Signals, Angular Material, y testing con Karma/Jasmine.

---

## Tecnologías

- Angular 20
- TypeScript 5.8
- Angular Material
- RxJS 7.8
- ESLint + Prettier para linting y formateo
- Husky + lint-staged para hooks de git
- Karma + Jasmine para testing
- Docker

---

## Requisitos

- Node.js v18+
- npm v9+
- Docker (opcional, para contenedores)

---

## Instalación

Clona el repositorio y ejecuta:

```bash
npm install
```

---

## Scripts disponibles

| Script                  | Descripción                                      |
| ----------------------- | ------------------------------------------------ |
| `npm start`             | Levanta el servidor de desarrollo con hot reload |
| `npm run build`         | Construye el proyecto en modo desarrollo         |
| `npm run build:prod`    | Construye el proyecto para producción            |
| `npm run watch`         | Construcción en modo watch para desarrollo       |
| `npm test`              | Ejecuta los tests en modo interactivo            |
| `npm run test:ci`       | Ejecuta tests en modo CI (sin watch, headless)   |
| `npm run test:coverage` | Ejecuta tests y genera reporte de cobertura      |
| `npm run lint`          | Ejecuta ESLint para análisis estático            |
| `npm run lint:fix`      | Ejecuta ESLint con autofix                       |

---

## Testing

Se utiliza Karma con Jasmine para pruebas unitarias.

Ejecuta:

```bash
npm test
```

Para integración continua:

```bash
npm run test:ci
```

Para reporte de cobertura:

```bash
npm run test:coverage
```

Además, Husky está configurado para ejecutar los tests automáticamente antes de cada push.

---

## Linting y formateo

Se usa ESLint con reglas específicas para Angular y Prettier para formateo.

Para analizar el código:

```bash
npm run lint
```

Para corregir automáticamente problemas de formato y estilo:

```bash
npm run lint:fix
```

Además, Husky y lint-staged están configurados para ejecutar Prettier y ESLint automáticamente antes de cada commit.

## Docker

Este proyecto incluye un `Dockerfile` para construir y servir la aplicación en un contenedor.

### Construir la imagen

```bash
docker build -t riu-frontend .
```

### Ejecutar el contenedor

```bash
docker run -d -p 4200:80 --name riu-frontend-container riu-frontend
```

Luego accede a `http://localhost:4200` en tu navegador.

---

## Estructura del proyecto

- `src/app/features/heroes` - Todo lo relacionado con la feature de héroes: componentes, formularios, layout, servicios, constantes, interfaces y tests específicos de esta feature.
- `src/app/core/` - Servicios singleton, interceptores, tokens de inyección, loaders y lógica global que se utiliza en toda la aplicación.
- `src/app/shared/` - Componentes, directivas, pipes, utilidades y módulos reutilizables en varias partes de la aplicación. Aquí deben ir los helpers y utilidades genéricas.

## Notas sobre el interceptor y backend simulado

- El interceptor para mostrar el loader en operaciones HTTP está implementado y configurado correctamente.
- Actualmente la aplicación utiliza datos almacenados localmente en servicios sin backend real.
- Por limitaciones de tiempo y para priorizar funcionalidades principales, no se implementó un backend simulado con librerías como `angular-in-memory-web-api`.
- La arquitectura está preparada para integrar un backend o simulación en el futuro.
