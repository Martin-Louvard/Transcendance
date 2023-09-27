#!/bin/sh

# Toggle 'localhost' and <host_ip>

SRCS=frontend/srcs/src
IP=$(hostname -i)

if grep -rq "10.33.4.3:3001" $SRCS; then
    find $SRCS -type f -exec sed -i "s|$IP:|localhost:|g" {} +
    echo "Replaced $IP with localhost"
else
    find $SRCS -type f -exec sed -i "s|localhost:|$IP:|g" {} +
    echo "Replaced localhost with $IP"
fi
