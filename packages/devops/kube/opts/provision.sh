#!/bin/bash
printf "./provision <preserveKubectl>\npreserverKubectl: defaults: false]\n\n"
if [ -z "$1" ]
then
kubectl delete pods,svc,deployment --all
else
echo "false"
fi
kubectl apply -f ./mongo.yaml
kubectl apply -f ./deployment.yaml
kubectl apply -f ./ingress.yaml
