kubectl expose deployment nginx-deployment --type=LoadBalancer --name=my-service
kubectl apply -f ./ingress/main.yaml
minikube service my-service.yaml

kubectl apply -f ./rp2-container/service.yaml

kubectl apply -f ./rp2-container/mongo-deployment.yaml

kubectl expose deployment my-db --type=LoadBalancer --name db-svc --port 27017

kubectl apply -f ./rp2-container/deployment.yaml