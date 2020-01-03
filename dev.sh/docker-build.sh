DOCKER_BUILDKIT=1 docker build . -f ./packages/devops/docker/DockerfileStage -t robertmozeika/rp2-stage:latest
DOCKER_BUILDKIT=1 docker build . -f ./packages/devops/docker/DockerfileStage2 -t robertmozeika/rp2-live:latest

docker run -p 8080:8080 --name test --network host robertmozeika/rp2-live:latest