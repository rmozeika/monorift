kubectl expose deployment nginx-deployment --type=LoadBalancer --name=my-service
kubectl apply -f ./ingress/main.yaml
minikube service my-service.yaml

kubectl apply -f ./rp2-container/service.yaml

kubectl apply -f ./rp2-container/mongo-deployment.yaml

kubectl expose deployment my-db --type=LoadBalancer --name db-svc --port 27017

kubectl apply -f ./rp2-container/deployment.yaml

kubectl expose pod rppod --type=LoadBalancer --name ws-svc --port 8080

sed -i '11i\PATH=$PATH:/var/lib/snapd/snap/bin\' .bash_profile

echo "PATH=$PATH:/var/lib/snapd/snap/bin" > .bash_profile

gcloud compute instances add-access-config vm-instance-2 --access-config-name "monorift" --address 34.102.129.166