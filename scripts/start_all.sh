#!/bin/bash

echo "==============================="
echo "Iniciando servicios Tapo..."
echo "==============================="

sudo systemctl start tapo-recorder.service
sudo systemctl start tapo-uploader.service

sleep 2

echo ""
echo "Estado actual:"
systemctl is-active tapo-recorder.service
systemctl is-active tapo-uploader.service

echo ""
echo "Servicios iniciados."
