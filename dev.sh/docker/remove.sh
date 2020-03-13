docker image rm robertmozeika/rp2-stage:latest

docker image rm robertmozeika/rp2-live:latest
# DOCKER_BUILDKIT=1 docker build . -f ./packages/devops/docker/DockerfileStage2 -t robertmozeika/rp2-live:latest