# Contexto Técnico para Despliegue - Storefront Toyota (Saleor)

## Resumen del Proyecto

Este es un **storefront e-commerce** desarrollado con **Next.js 15** que utiliza **Saleor** como backend de e-commerce. Es una aplicación web moderna para la venta de productos Toyota con funcionalidades completas de carrito, checkout, pagos y gestión de usuarios.

## Stack Tecnológico Principal

### Frontend Framework

- **Next.js 15** con App Router
- **React 19**
- **TypeScript** (modo estricto)
- **TailwindCSS** con plugins personalizados

### Backend Integration

- **Saleor GraphQL API** (backend de e-commerce)
- **GraphQL Codegen** para tipos TypeScript automáticos
- **URQL** como cliente GraphQL

### Gestión de Estado

- **Zustand** para estado global
- **Formik + Yup** para formularios y validación

### Pagos

- **Stripe** integration
- **Adyen** integration

## Arquitectura de la Aplicación

### Estructura de Rutas

- `/` - Página principal
- `/[channel]` - Rutas dinámicas por canal (ej: `/toyota-web`)
- `/checkout` - Proceso de compra completo
- `/products/[slug]` - Páginas de productos
- `/blog` - Sistema de blog integrado

### Componentes Principales

- **Checkout completo** con autenticación, direcciones, pagos
- **Catálogo de productos** con filtros y búsqueda
- **Sistema de autenticación** con Saleor Auth SDK
- **Gestión de almacenes** (warehouses) con modo single/all
- **Carrito de compras** persistente
- **Mi cuenta** con historial de pedidos

## Variables de Entorno Requeridas

### Variables Obligatorias

```bash
NEXT_PUBLIC_SALEOR_API_URL=https://tu-saleor-backend.com/graphql/
NEXT_PUBLIC_STOREFRONT_URL=https://tu-dominio.com
```

### Variables Opcionales

```bash
# Autenticación
SALEOR_APP_TOKEN=tu_app_token

# Configuración de canal por defecto
NEXT_PUBLIC_DEFAULT_CHANNEL=toyota-web

# Configuración de almacén
NEXT_PUBLIC_WAREHOUSE_MODE=all|single
NEXT_PUBLIC_WAREHOUSE_ID=warehouse_id
NEXT_PUBLIC_WAREHOUSE_SLUG=warehouse-slug

# Colección principal
NEXT_PUBLIC_HOME_COLLECTION_SLUG=featured-products

# Integraciones opcionales
NEXT_PUBLIC_GA_ID=google_analytics_id
NEXT_PUBLIC_FACEBOOK_APP_ID=facebook_app_id
NEXT_PUBLIC_DISQUS_SHORTNAME=disqus_shortname
NEXT_PUBLIC_NEWSLETTER_ENDPOINT=newsletter_endpoint
NEXT_PUBLIC_ADOBE_FONTS_KIT_ID=adobe_fonts_id
NEXT_PUBLIC_HELVETICA_NEUE_CSS=helvetica_css_url
```

## Configuración de Build y Deploy

### Requisitos del Sistema

- **Package Manager:** `pnpm` (versión >=9.4.0)
- **Node.js:** >=20
- **Build Output:** `standalone` (optimizado para Docker)

### Scripts Importantes

```bash
pnpm dev          # Desarrollo
pnpm build        # Build de producción
pnpm start        # Servidor de producción
pnpm generate     # Generar tipos GraphQL
pnpm lint         # Linting y formato
```

## Docker Configuration

### Dockerfile Multi-stage

- **deps**: Instalación de dependencias con pnpm
- **builder**: Build de la aplicación Next.js
- **runner**: Imagen de producción optimizada

### Docker Compose

- Puerto: `3000`
- Red: `saleor_network`
- Variables de entorno inyectadas en build time

## Características Técnicas Específicas

### GraphQL Integration

- **Codegen automático** de tipos TypeScript
- **Fragments reutilizables** para optimización
- **Autenticación** con tokens de Saleor
- **Cache** y revalidación configurada

### UI/UX

- **Diseño responsive** con TailwindCSS
- **Tema Toyota** con colores corporativos
- **Componentes reutilizables** modulares
- **Internacionalización** preparada (es-MX por defecto)

### Performance

- **Image optimization** con Next.js
- **Static generation** donde es posible
- **Bundle optimization** con standalone output
- **GraphQL query optimization**

## Dependencias Críticas

### Producción

- `@saleor/auth-sdk` - Autenticación
- `urql` - Cliente GraphQL
- `@stripe/stripe-js` - Pagos Stripe
- `@adyen/adyen-web` - Pagos Adyen
- `zustand` - Estado global
- `formik` + `yup` - Formularios

### Desarrollo

- `@graphql-codegen/cli` - Generación de tipos
- `eslint` + `prettier` - Code quality
- `playwright` - Testing E2E
- `husky` + `lint-staged` - Git hooks

## Consideraciones de Deploy

### Requisitos del Servidor

- **Node.js 20+**
- **pnpm** como package manager
- **Variables de entorno** configuradas
- **Conexión a Saleor backend**

### Optimizaciones Incluidas

- **Standalone build** para Docker
- **Image optimization** automática
- **Bundle splitting** inteligente
- **Cache headers** configurados

### Monitoreo Recomendado

- **Health checks** en `/api/health`
- **Logs** de errores GraphQL
- **Métricas** de performance
- **SSL/TLS** obligatorio para producción

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── [channel]/         # Rutas dinámicas por canal
│   ├── checkout/          # Proceso de checkout
│   └── api/               # API routes
├── checkout/              # Componentes de checkout
├── ui/                    # Componentes UI reutilizables
├── lib/                   # Utilidades y configuración
├── graphql/               # Queries y mutations GraphQL
└── hooks/                 # Custom hooks
```

## Comandos de Deploy

### Desarrollo Local

```bash
pnpm install
pnpm generate  # Generar tipos GraphQL
pnpm dev
```

### Producción

```bash
pnpm install
pnpm generate
pnpm build
pnpm start
```

### Docker

```bash
docker-compose up --build
```

## Notas Importantes

1. **GraphQL Codegen**: Debe ejecutarse antes del build para generar tipos
2. **Variables de entorno**: Críticas para la conexión con Saleor
3. **Standalone build**: Optimizado para contenedores Docker
4. **Autenticación**: Requiere configuración correcta de Saleor backend
5. **Pagos**: Configuración adicional necesaria para Stripe/Adyen
