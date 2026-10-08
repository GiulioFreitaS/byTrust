#!/bin/sh
# entrypoint.sh
# Caminho: cron-ingest/entrypoint.sh
#
# Executado pelo Railway Cron Service a cada disparo.
# As variáveis de ambiente são configuradas no painel do Railway.

set -e

if [ -z "$BACKEND_URL" ]; then
  echo "[cron-ingest] ERRO: BACKEND_URL não definida."
  exit 1
fi

if [ -z "$ADMIN_SECRET" ]; then
  echo "[cron-ingest] ERRO: ADMIN_SECRET não definida."
  exit 1
fi

echo "[cron-ingest] Disparando ingestão — $(date -u '+%Y-%m-%dT%H:%M:%SZ')"

HTTP_STATUS=$(curl -s -o /tmp/response.json -w "%{http_code}" \
  --max-time 300 \
  -X POST "${BACKEND_URL}/api/admin/news-ingest" \
  -H "x-admin-secret: ${ADMIN_SECRET}" \
  -H "Content-Type: application/json")

RESPONSE=$(cat /tmp/response.json)

echo "[cron-ingest] HTTP ${HTTP_STATUS}: ${RESPONSE}"

if [ "$HTTP_STATUS" != "200" ]; then
  echo "[cron-ingest] FALHA — status HTTP inesperado: ${HTTP_STATUS}"
  exit 1
fi

echo "[cron-ingest] Concluído com sucesso."
