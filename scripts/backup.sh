#!/usr/bin/env bash
# Dnevni bekap baze (pokretati iz cron-a). Bekap MORA završiti van Mac Minija —
# postavi BACKUP_REMOTE (rclone remote ili rsync destinaciju) u okruženju.
#
# Primer cron unosa (svaki dan u 03:30):
#   30 3 * * * BACKUP_REMOTE="gdrive:bekap-bendovi" /putanja/do/scripts/backup.sh
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/svadbeni-bendovi}"
DB_NAME="${DB_NAME:-svadbeni_bendovi}"
KEEP_DAYS="${KEEP_DAYS:-30}"

mkdir -p "$BACKUP_DIR"
FILE="$BACKUP_DIR/${DB_NAME}_$(date +%Y%m%d_%H%M%S).sql.gz"

pg_dump "$DB_NAME" | gzip > "$FILE"
echo "Bekap napravljen: $FILE"

# obriši lokalne bekape starije od KEEP_DAYS dana
find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -mtime "+$KEEP_DAYS" -delete

# kopija van mašine — jedna tačka otkaza (Mac Mini) = ceo biznis
if [ -n "${BACKUP_REMOTE:-}" ]; then
  if command -v rclone >/dev/null; then
    rclone copy "$FILE" "$BACKUP_REMOTE"
    echo "Bekap kopiran na: $BACKUP_REMOTE"
  else
    rsync -az "$FILE" "$BACKUP_REMOTE"
    echo "Bekap kopiran (rsync) na: $BACKUP_REMOTE"
  fi
else
  echo "UPOZORENJE: BACKUP_REMOTE nije postavljen — bekap je samo na ovoj mašini!" >&2
fi
