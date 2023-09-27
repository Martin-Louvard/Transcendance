#!/bin/sh

# Toggle 'localhost' and <host_ip>

SRCS=frontend/srcs/src
IP=$(hostname -i)

if grep -rq "10.33.4.3:3001" $SRCS; then
    find $SRCS -type f -exec sed -i "s|$IP:3001|localhost:3001|g" {} +
    echo "Replaced $IP:3001 with localhost:3001"
else
    find $SRCS -type f -exec sed -i "s|localhost:3001|$IP:3001|g" {} +
    echo "Replaced localhost:3001 with $IP:3001"
fi
