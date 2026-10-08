# Dockerfile
# Caminho: cron-ingest/Dockerfile
#
# Container do Railway Cron Service.
# Só precisa de curl — sem Node, sem banco, sem dependências.
# O Railway agenda a execução deste container via cron schedule.

FROM alpine:3.19

RUN apk add --no-cache curl

# O script que será executado em cada disparo do cron
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
