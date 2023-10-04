#!/bin/bash


NPM_DEV_FLAGS="$1"

npm install \
    && npm i bcrypt @types/bcrypt \
	&& npm i anymatch \
    && npm i -g @nestjs/cli --save-dev \
    && npx prisma db push \
    && npx prisma generate \
    && npx prisma db seed \
    && npm run start:dev -- ${DEV_FLAGS}

