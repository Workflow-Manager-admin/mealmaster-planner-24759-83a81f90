#!/bin/bash
cd /home/kavia/workspace/code-generation/mealmaster-planner-24759-83a81f90/mealplanner_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

