#!/bin/bash

# Script para verificar que el SALEOR_APP_TOKEN funciona correctamente
# Uso: ./scripts/verify-token.sh [URL] [TOKEN]

SALEOR_URL="${1:-http://54.83.250.117:8000/graphql/}"
TOKEN="${2:-${SALEOR_APP_TOKEN}}"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: No se proporcionó el token"
    echo "Uso: $0 [URL] [TOKEN]"
    echo "O establece la variable de entorno SALEOR_APP_TOKEN"
    exit 1
fi

echo "🔍 Verificando token en: $SALEOR_URL"
echo ""

# Query de prueba para verificar el token
QUERY='{"query":"query { channels { id name slug currencyCode } }"}'

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$SALEOR_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$QUERY")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    # Verificar si hay errores en la respuesta
    if echo "$BODY" | grep -q '"errors"'; then
        echo "❌ El token es inválido o no tiene los permisos necesarios"
        echo ""
        echo "Respuesta:"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
        exit 1
    else
        echo "✅ Token válido y funcionando correctamente"
        echo ""
        echo "Canales encontrados:"
        echo "$BODY" | jq '.data.channels[] | {name: .name, slug: .slug, currency: .currencyCode}' 2>/dev/null || echo "$BODY"
        exit 0
    fi
else
    echo "❌ Error HTTP: $HTTP_CODE"
    echo ""
    echo "Respuesta:"
    echo "$BODY"
    exit 1
fi

