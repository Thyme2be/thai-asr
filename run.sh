#!/bin/bash

# Launch backend in new terminal
gnome-terminal -- bash -c "
    echo 'Opening backend terminal...';
    source ~/anaconda3/bin/activate;
    cd ~/projects/thai-asr/fastapi-backend;
    conda activate thai-asr;
    echo 'Conda activate thai-asr...';
    fastapi dev app/main.py;
    echo 'Successfully start backend with Fastapi...';
    exec bash
"

# Launch Riva-server to deploy model
gnome-terminal -- bash -c "
    echo 'Opening frontend terminal...';
    cd ~/projects/thai-asr/fastapi-backend/riva_quickstart_v2.19.0;
    . riva_start.sh config.sh
    echo 'Successfully start Riva Server...';
    exec bash
"

# Wait a bit to ensure backend terminal opens first
sleep 10

# Launch frontend in another terminal
gnome-terminal -- bash -c "
    echo 'Opening frontend terminal...';
    cd ~/projects/thai-asr/next-frontend;
    npm run dev;
    echo 'Successfully start frontend with Next.js...';
    exec bash
"