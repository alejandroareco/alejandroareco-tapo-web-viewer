#!/bin/bash
set -uo pipefail

BASE_DIR="/home/alejandro/tapo/cams"
LOG_FILE="/home/alejandro/tapo/logs/cleanup.log"
BUCKET="tapo-archive"

echo "---- $(date --iso-8601=seconds) ----" >> "$LOG_FILE"

DELETED=0
SKIPPED=0

find "$BASE_DIR" -type f -path "*/recordings/*.mp4" -mtime +2 -print0 2>/dev/null |
while IFS= read -r -d '' FILE; do

  # Si desapareció, ignorar
  [ -f "$FILE" ] || continue

  # Si está en uso, ignorar
  if lsof "$FILE" >/dev/null 2>&1; then
    echo "SKIP (in use): $FILE" >> "$LOG_FILE"
    ((SKIPPED++))
    continue
  fi

  CAM_NAME="$(echo "$FILE" | awk -F'/' '{print $(NF-2)}')"
  FILE_NAME="$(basename "$FILE")"
  DATE_PART="$(echo "$FILE_NAME" | cut -d'_' -f1)"

  YEAR="$(echo "$DATE_PART" | cut -d'-' -f1)"
  MONTH="$(echo "$DATE_PART" | cut -d'-' -f2)"
  DAY="$(echo "$DATE_PART" | cut -d'-' -f3)"

  S3_KEY="tapo-cam/$CAM_NAME/year=$YEAR/month=$MONTH/day=$DAY/$FILE_NAME"

  # Solo borrar si existe en S3
  if timeout 20 aws s3api head-object --bucket "$BUCKET" --key "$S3_KEY" >/dev/null 2>&1; then
    echo "Deleting (exists in S3): $FILE" >> "$LOG_FILE"
    rm -f "$FILE"
    ((DELETED++))
  else
    echo "SKIP (not in S3): $FILE" >> "$LOG_FILE"
    ((SKIPPED++))
  fi

done

echo "Deleted: $DELETED | Skipped: $SKIPPED" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
