 ## <span style="color:#598BFF"> Mongo (w/ service) </span>

```kubectl apply -f ./mongo.yaml```
##### *<span style="color:black">service name: db-svc</span>*

## <span style="color:#598BFF">rp2 (server) </span>
#### just pod
```kubectl apply -f ./pods/rp2.yaml```

#### deployment (w/ service)
```kubectl apply -f ./deployment.yaml```
##### *<span style="color:black">service name: node-svc </span>*


## <span style="color:#598BFF"> Nginx </span>
```kubectl apply -f ./nginx.yaml```


## <span style="color:#598BFF"> Ingresss </span>
```kubectl apply -f ./mongo.yaml```