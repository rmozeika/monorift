#docker run -P -d --network="host" --name="rp2" rp2:latest
docker run -P -d--network="host" --name="mdb" mongo:3.6
or -p 27017:27017
#docker build -t rp2:latest .
docker exec -it rp2_node_1 bash

docker run -p 27017:27017 -d mongo:3.6