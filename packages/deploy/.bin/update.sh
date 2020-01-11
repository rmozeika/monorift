#/bin/bash

cd ../devops/docker
pwd
docker-compose down
cd ../../..
git pull origin remote
pwd
DOCKER_BUILDKIT=1 docker build . -f ./packages/devops/docker/DockerfileStage2 -t robertmozeika/rp2-live:latest
# BACK_PID=$!
# while kill -0 $BACK_PID ; do
#     echo "Process is still active..."
#     sleep 1
#     # You can add a timeout here if you want
# done
echo "compose up"
cd ./packages/devops/docker
docker-compose up -d
echo "Updating- logs"
echo "Finished"

