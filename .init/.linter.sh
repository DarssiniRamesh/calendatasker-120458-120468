#!/bin/bash
cd /home/kavia/workspace/code-generation/calendatasker-120458-120468/calendar_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

