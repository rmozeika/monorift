#!/bin/bash
docker image rm robertmozeika/rp2-stage:latest

docker image rm robertmozeika/rp2-live:latest

yarn run build:phase1
yarn run build:phase2

docker push robertmozeika/rp2-stage:latest
docker push robertmozeika/rp2-live:latest