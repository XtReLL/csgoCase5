#!/usr/bin/env bash
if [ -z "$1" ]
then
    echo "Error! Set parameter (tag) for social, example: [latest or test]";
    exit 1;
fi
docker build -t $1 . ;