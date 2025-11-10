# Guía para Crear App Token en Saleor

## Paso 1: Acceder al Panel de Administración de Saleor

1. Abre tu navegador y ve a: `http://54.83.250.117:8000/dashboard/`
2. Inicia sesión con tus credenciales de administrador

## Paso 2: Crear una Nueva App

1. En el menú lateral, ve a **"Apps"** o **"Aplicaciones"**
2. Haz clic en **"Create App"** o **"Crear Aplicación"**
3. Completa el formulario:
   - **Name**: `Storefront Frontend` (o el nombre que prefieras)
   - **Type**: Selecciona **"Custom"** o **"Personalizada"**
   - **Description** (opcional): `Token para el storefront de producción`

## Paso 3: Configurar Permisos

Una vez creada la app, necesitas asignarle los permisos correctos:

### Permisos Mínimos Requeridos:

1. **AUTHENTICATED_APP** - Este es el permiso principal que necesitas para consultar canales
2. Opcionalmente, puedes agregar:
   - **HANDLE_CHECKOUTS** - Si necesitas crear/actualizar checkouts desde el servidor
   - **HANDLE_PAYMENTS** - Si necesitas procesar pagos

### Cómo asignar permisos:

1. En la página de la app que acabas de crear, busca la sección **"Permissions"** o **"Permisos"**
2. Haz clic en **"Manage Permissions"** o **"Gestionar Permisos"**
3. Marca la casilla para **"AUTHENTICATED_APP"**
4. Guarda los cambios

## Paso 4: Crear el App Token

1. En la página de la app, busca la sección **"Tokens"** o **"Tokens"**
2. Haz clic en **"Create Token"** o **"Crear Token"**
3. Completa el formulario:
   - **Name**: `Production Storefront Token` (o el nombre que prefieras)
   - **Token Type**: Selecciona **"App Token"**
4. Haz clic en **"Create"** o **"Crear"**

## Paso 5: Copiar el Token

⚠️ **IMPORTANTE**: El token solo se muestra UNA VEZ. Asegúrate de copiarlo inmediatamente.

1. Copia el token completo que se muestra (será una cadena larga de caracteres)
2. Guárdalo en un lugar seguro temporalmente

## Paso 6: Agregar el Token al Archivo de Configuración

1. En tu servidor, edita el archivo `/etc/market/agora.env`:

   ```bash
   sudo nano /etc/market/agora.env
   ```

2. Agrega o actualiza la línea:

   ```bash
   SALEOR_APP_TOKEN=tu_token_aqui
   ```

3. Reemplaza `tu_token_aqui` con el token que copiaste en el paso anterior

4. Guarda el archivo (Ctrl+O, Enter, Ctrl+X en nano)

## Paso 7: Verificar que el Token Funciona

Puedes verificar que el token funciona usando la página de debug:

1. Despliega la aplicación nuevamente con Jenkins
2. Visita: `http://54.83.250.117:5010/debug`
3. Deberías ver:
   - ✅ Token: Configurado
   - ✅ API responde correctamente
   - ✅ Query ejecutada: [número] tipos encontrados

## Alternativa: Crear Token vía GraphQL

Si prefieres crear el token mediante GraphQL, sigue estos pasos:

### Paso 0: Crear la App (si no existe)

Si no tienes una app creada, primero créala con esta mutación:

```graphql
mutation AppCreate($input: AppInput!) {
	appCreate(input: $input) {
		app {
			id
			name
			type
		}
		errors {
			field
			message
		}
	}
}
```

**Variables:**

```json
{
	"input": {
		"name": "Storefront Frontend",
		"type": "CUSTOM"
	}
}
```

O si prefieres usar curl:

```bash
curl -X POST http://54.83.250.117:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_DE_ADMIN" \
  -d '{
    "query": "mutation AppCreate($input: AppInput!) { appCreate(input: $input) { app { id name type } errors { field message } } }",
    "variables": {
      "input": {
        "name": "Storefront Frontend",
        "type": "CUSTOM"
      }
    }
  }'
```

**Importante**: Después de crear la app, necesitas asignarle el permiso `AUTHENTICATED_APP`. Esto normalmente se hace desde el dashboard, pero también puedes hacerlo con GraphQL (ver más abajo).

### Paso 1: Obtener el ID de tu App

Una vez que tengas la app creada, obtén su ID con esta query:

```graphql
query {
	apps(first: 10) {
		edges {
			node {
				id
				name
				type
			}
		}
	}
}
```

**Nota**: Esta query requiere permisos de administrador. Debes estar autenticado como staff user.

Busca en la respuesta el `id` de tu app (será algo como `"QXBwOjE="` o similar).

### Paso 2: Asignar Permisos a la App

Antes de crear el token, asegúrate de que la app tenga el permiso `AUTHENTICATED_APP`. Puedes hacerlo desde el dashboard o con esta mutación:

```graphql
mutation AppUpdate($id: ID!, $permissions: [PermissionEnum!]) {
	appUpdate(id: $id, input: { permissions: $permissions }) {
		app {
			id
			name
			permissions {
				code
				name
			}
		}
		errors {
			field
			message
		}
	}
}
```

**Variables:**

```json
{
	"id": "QXBwOjE=",
	"permissions": ["AUTHENTICATED_APP"]
}
```

### Paso 3: Crear el Token

Una vez que tengas el ID de la app y los permisos asignados, crea el token con esta mutación:

```graphql
mutation AppTokenCreate($app: ID!, $name: String!) {
	appTokenCreate(input: { app: $app, name: $name }) {
		authToken
		appToken {
			id
			name
			authToken
		}
		errors {
			field
			message
		}
	}
}
```

**Variables** (reemplaza `ID_DE_TU_APP` con el ID que obtuviste en el paso 1):

```json
{
	"app": "QXBwOjE=",
	"name": "Production Storefront Token"
}
```

### Ejemplo completo usando curl:

```bash
# 1. Primero obtén el ID de la app (necesitas estar autenticado como admin)
curl -X POST http://54.83.250.117:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_DE_ADMIN" \
  -d '{
    "query": "query { apps(first: 10) { edges { node { id name type } } } }"
  }'

# 2. Asigna permisos a la app (reemplaza ID_DE_TU_APP con el ID obtenido)
curl -X POST http://54.83.250.117:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_DE_ADMIN" \
  -d '{
    "query": "mutation AppUpdate($id: ID!, $permissions: [PermissionEnum!]) { appUpdate(id: $id, input: { permissions: $permissions }) { app { id name permissions { code } } errors { field message } } }",
    "variables": {
      "id": "ID_DE_TU_APP",
      "permissions": ["AUTHENTICATED_APP"]
    }
  }'

# 3. Luego crea el token usando el ID obtenido
curl -X POST http://54.83.250.117:8000/graphql/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_DE_ADMIN" \
  -d '{
    "query": "mutation AppTokenCreate($app: ID!, $name: String!) { appTokenCreate(input: { app: $app, name: $name }) { authToken appToken { id name } errors { field message } } }",
    "variables": {
      "app": "QXBwOjE=",
      "name": "Production Storefront Token"
    }
  }'
```

El `authToken` en la respuesta es el token que necesitas usar como `SALEOR_APP_TOKEN`.

### Nota sobre autenticación:

Para ejecutar estas queries/mutaciones, necesitas estar autenticado como usuario staff con permisos `MANAGE_APPS`. Puedes:

- Usar el token de sesión de tu usuario admin
- O crear un token de staff user primero

## Troubleshooting

### Error: "To access this path, you need one of the following permissions: AUTHENTICATED_APP"

- Verifica que la app tiene el permiso **AUTHENTICATED_APP** asignado
- Verifica que estás usando el token correcto (no el ID de la app, sino el token)

### Error: "Invalid token"

- Verifica que el token está correctamente copiado (sin espacios al inicio o final)
- Verifica que el token no ha expirado (si configuraste expiración)
- Verifica que el archivo `/etc/market/agora.env` tiene el formato correcto

### El token no aparece en la respuesta

- Algunas versiones de Saleor requieren que habilites la visibilidad del token en la configuración de la app
- Verifica que la app está activa

## Notas Importantes

1. **Seguridad**: El token tiene acceso a las operaciones permitidas por los permisos de la app. Mantén el token seguro y no lo compartas.

2. **Permisos Mínimos**: Solo asigna los permisos que realmente necesitas. El permiso `AUTHENTICATED_APP` es suficiente para consultar canales.

3. **Backup**: Guarda el token en un gestor de contraseñas o en un lugar seguro, ya que no podrás verlo de nuevo después de crearlo.

4. **Diferentes Entornos**: Asegúrate de tener tokens diferentes para desarrollo y producción.
