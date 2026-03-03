#!/bin/bash
set -uo pipefail

BASE_DIR="/home/alejandro/tapo/cams"
LOG_FILE="/home/alejandro/tapo/logs/upload.log"
BUCKET="tapo-archive"

LOCK="/tmp/tapo-uploader.lock"

mkdir -p "$(dirname "$LOG_FILE")"

{
  echo "---- $(date --iso-8601=seconds) ----"
  echo "Uploader iniciado. BASE_DIR=$BASE_DIR BUCKET=$BUCKET"
} >> "$LOG_FILE"

# Evita ejecuciones paralelas
exec 9>"$LOCK"
if ! flock -n 9; then
  echo "Otro uploader ya está corriendo. Salgo." >> "$LOG_FILE"
  exit 0
fi

# Buscar mp4 dentro de recordings/ con más de 2 min
find "$BASE_DIR" -type f -path "*/recordings/*.mp4" -mmin +2 -print0 2>/dev/null |
while IFS= read -r -d '' FILE; do

  # Si el archivo desapareció, lo ignoramos
  if [ ! -f "$FILE" ]; then
    echo "Archivo ya no existe, skip: $FILE" >> "$LOG_FILE"
    continue
  fi

  CAM_NAME="$(echo "$FILE" | awk -F'/' '{print $(NF-2)}')"
  FILE_NAME="$(basename "$FILE")"
  DATE_PART="$(echo "$FILE_NAME" | cut -d'_' -f1)"

  YEAR="$(echo "$DATE_PART" | cut -d'-' -f1)"
  MONTH="$(echo "$DATE_PART" | cut -d'-' -f2)"
  DAY="$(echo "$DATE_PART" | cut -d'-' -f3)"

  S3_KEY="tapo-cam/$CAM_NAME/year=$YEAR/month=$MONTH/day=$DAY/$FILE_NAME"
  S3_PATH="s3://$BUCKET/$S3_KEY"

  if timeout 20 aws s3api head-object --bucket "$BUCKET" --key "$S3_KEY" >/dev/null 2>&1; then
    echo "Already exists in S3: $S3_KEY" >> "$LOG_FILE"
    continue
  fi

  echo "Uploading $FILE -> $S3_PATH" >> "$LOG_FILE"

  if timeout 180 aws s3 cp "$FILE" "$S3_PATH" >> "$LOG_FILE" 2>&1; then
    echo "OK: $S3_KEY" >> "$LOG_FILE"
  else
    echo "ERROR uploading: $S3_KEY" >> "$LOG_FILE"
  fi

done

echo "Uploader finalizado correctamente." >> "$LOG_FILE"
