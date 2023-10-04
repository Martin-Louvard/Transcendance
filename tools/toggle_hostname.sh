#!/bin/sh

# Toggle 'localhost' and <host_ip>

SRCS=frontend/srcs/src
IP="${process.env.IP}"

if grep -rq $IP $SRCS; then
    find $SRCS -type f -exec sed -i "s|$IP:|localhost:3001|g" {} +
    echo "Replaced $IP with localhost"
else
    find $SRCS -type f -exec sed -i "s|localhost:3001|$IP|g" {} +
    echo "Replaced localhost with $IP"
fi
