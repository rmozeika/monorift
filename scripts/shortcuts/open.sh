#!/bin/bash

if [ "$1" != "monorift" ]; then
    echo "Positional parameter 1 contains something"
if [ "$1" != "src" ]; then
    code ./

else
    echo "Positional parameter 1 is empty"
fi