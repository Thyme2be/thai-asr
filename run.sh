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
