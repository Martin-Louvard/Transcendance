#!/bin/bash
npm install && npm i bcrypt @types/bcrypt &&npm i -g @nestjs/cli --save-dev && npx prisma db push && npx prisma generate && npx prisma db seed && npm run start:dev
