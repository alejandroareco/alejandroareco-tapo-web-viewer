#!/bin/bash

CAM_NAME=$1

if [ -z "$CAM_NAME" ]; then
  echo "Usage: record.sh cam-01|cam-02|cam-03"
  exit 1
fi

BASE_DIR="/home/alejandro/tapo/cams/$CAM_NAME"
CONFIG_FILE="$BASE_DIR/config.env"
OUTPUT_DIR="$BASE_DIR/recordings"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "Config file not found for $CAM_NAME"
  exit 1
fi

source "$CONFIG_FILE"

RTSP_URL="rtsp://${RTSP_USER}:${RTSP_PASS}@${RTSP_IP}:554/stream1"

mkdir -p "$OUTPUT_DIR"

ffmpeg -rtsp_transport tcp \
-fflags +genpts \
-use_wallclock_as_timestamps 1 \
-i "$RTSP_URL" \
-an \
-c:v copy \
-f segment \
-segment_time 300 \
-reset_timestamps 1 \
-strftime 1 \
"$OUTPUT_DIR/%Y-%m-%d_%H-%M-%S.mp4"
