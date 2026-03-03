#!/bin/bash

echo "==============================="
echo "Deteniendo servicios Tapo..."
echo "==============================="

sudo systemctl stop tapo-uploader.service
sudo systemctl stop tapo-recorder.service

sleep 2

echo ""
echo "Estado actual:"
systemctl is-active tapo-recorder.service
systemctl is-active tapo-uploader.service

echo ""
echo "Servicios detenidos."
