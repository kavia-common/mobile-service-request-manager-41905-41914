#!/bin/bash
cd /home/kavia/workspace/code-generation/mobile-service-request-manager-41905-41914/frontend_reactjs
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

