# Blog Toyota - Sistema de Gestión de Contenido

Este directorio contiene toda la lógica y datos para el sistema de blog de Toyota Refacciones.

## Estructura

```
src/lib/blog/
├── types.ts          # Tipos TypeScript para el blog
├── data.ts           # Datos dummy de artículos, autores y categorías
├── images.ts         # Configuración de imágenes del blog
└── README.md         # Este archivo
```

## Componentes del Blog

Los componentes del blog se encuentran en `src/ui/components/blog/`:

- **ArticleCard**: Tarjeta para mostrar artículos en listas
- **AuthorInfo**: Información del autor con avatar y redes sociales
- **BlogHeader**: Encabezado del blog con categorías
- **SearchBar**: Barra de búsqueda de artículos
- **RelatedArticles**: Artículos relacionados
- **Pagination**: Navegación de páginas
- **BlogStats**: Estadísticas del blog

## Funcionalidades Implementadas

### ✅ Completadas

- [x] Estructura de tipos TypeScript
- [x] 6 artículos dummy profesionales
- [x] Sistema de categorías
- [x] Sistema de autores con perfiles
- [x] Búsqueda de artículos
- [x] Paginación
- [x] Artículos destacados
- [x] Artículos relacionados
- [x] SEO optimizado
- [x] Responsive design
- [x] Estadísticas del blog

### 🔄 En Desarrollo

- [ ] Sistema de comentarios
- [ ] Newsletter
- [ ] RSS Feed
- [ ] Sistema de likes/favoritos
- [ ] Compartir en redes sociales mejorado

## Artículos Incluidos

1. **Guía Completa de Mantenimiento Preventivo para tu Toyota**

   - Categoría: Mantenimiento
   - Autor: Carlos Mendoza
   - Tiempo de lectura: 8 min
   - Destacado: ✅

2. **Refacciones Originales vs. Genéricas: ¿Cuál Elegir?**

   - Categoría: Refacciones
   - Autor: Carlos Mendoza
   - Tiempo de lectura: 6 min

3. **Tecnología Híbrida Toyota: Todo lo que Necesitas Saber**

   - Categoría: Híbridos
   - Autor: Miguel Torres
   - Tiempo de lectura: 10 min
   - Destacado: ✅

4. **Sistemas de Seguridad Toyota: Protección Avanzada**

   - Categoría: Seguridad
   - Autor: Ana Rodríguez
   - Tiempo de lectura: 9 min

5. **Diagnóstico de Problemas Comunes en Vehículos Toyota**

   - Categoría: Mantenimiento
   - Autor: Ana Rodríguez
   - Tiempo de lectura: 7 min

6. **Innovaciones Tecnológicas en los Nuevos Modelos Toyota**
   - Categoría: Tecnología
   - Autor: Miguel Torres
   - Tiempo de lectura: 11 min
   - Destacado: ✅

## Categorías

- **Mantenimiento**: Consejos y guías para el mantenimiento
- **Refacciones**: Información sobre refacciones originales
- **Tecnología**: Novedades tecnológicas
- **Seguridad**: Consejos de seguridad y sistemas
- **Híbridos**: Todo sobre tecnología híbrida

## Autores

- **Carlos Mendoza**: Especialista en Refacciones Toyota
- **Ana Rodríguez**: Técnica en Mantenimiento Automotriz
- **Miguel Torres**: Experto en Sistemas Híbridos

## Uso

### Obtener todos los artículos

```typescript
import { blogData } from "@/lib/blog/data";
const articles = blogData.articles;
```

### Buscar artículo por slug

```typescript
import { getArticleBySlug } from "@/lib/blog/data";
const article = getArticleBySlug("guia-mantenimiento-preventivo-toyota");
```

### Obtener artículos por categoría

```typescript
import { getArticlesByCategory } from "@/lib/blog/data";
const articles = getArticlesByCategory("mantenimiento");
```

### Buscar artículos

```typescript
import { searchArticles } from "@/lib/blog/data";
const results = searchArticles("mantenimiento");
```

## Personalización

Para añadir nuevos artículos, edita el archivo `data.ts` y añade el artículo al array `articles` con la estructura definida en `types.ts`.

Para añadir nuevas categorías o autores, modifica los arrays correspondientes en `data.ts`.

## Imágenes

Las imágenes del blog deben colocarse en:

- Artículos: `/public/images/blog/`
- Autores: `/public/images/authors/`
- Categorías: `/public/images/categories/`

## SEO

Cada artículo incluye metadatos SEO optimizados:

- Meta title
- Meta description
- Keywords
- Open Graph tags

## Responsive Design

Todos los componentes están optimizados para:

- Móviles (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)
