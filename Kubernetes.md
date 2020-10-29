# Kubernetes Tutorial

## What is Kubernetes
Kubernetes is an open-source container-orchestration system for automating computer application deployment, scaling, and management. It was originally designed by Google and is now maintained by the Cloud Native Computing Foundation.

![Diagram of a Kubernetes cluster](https://d33wubrfki0l68.cloudfront.net/2475489eaf20163ec0f54ddc1d92aa8d4c87c96b/e7c81/images/docs/components-of-kubernetes.svg)

**Terminology:**
For clarity, this guide defines the following terms:

**Node**: A worker machine in Kubernetes, part of a cluster.
**Cluster**: A set of Nodes that run containerized applications managed by Kubernetes. For this example, and in most common Kubernetes deployments, nodes in the cluster are not part of the public internet.
**Edge router**: A router that enforces the firewall policy for your cluster. This could be a gateway managed by a cloud provider or a physical piece of hardware.
**Cluster network**: A set of links, logical or physical, that facilitate communication within a cluster according to the Kubernetes networking model.
**Service**: A Kubernetes Service that identifies a set of Pods using label selectors. Unless mentioned otherwise, Services are assumed to have virtual IPs only routable within the cluster network.


**Master Node:**
- API server : entrypoint to K8S cluster
- Controller manager: keeps track of whats happening in the cluster
- Scheduler: ensures Pods placement
- etcd: Kubernetes backing key-value store 

## Pods, Service & Ingress
*Pod*:
- Smallest unit of K8s
- Usally 1 applicaiton per Pod
- Each Pod gets its own IP address

*Service*:
An abstract way to expose an application running on a set of Pods as a network service.
With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

*Ingress*:
Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource. [Read More](https://kubernetes.io/docs/concepts/services-networking/ingress/)

## Config Map and Secret
*ConfigMaps:*
A ConfigMap is an API object used to store non-confidential data in key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or as configuration files in a volume.

A ConfigMap allows you to decouple environment-specific configuration from your container images, so that your applications are easily portable.

*Secrets:*
Kubernetes Secrets let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. Storing confidential information in a Secret is safer and more flexible than putting it verbatim in a Pod definition or in a container image.

## Volumes
On-disk files in a Container are ephemeral, which presents some problems for non-trivial applications when running in Containers. First, when a Container crashes, kubelet will restart it, but the files will be lost - the Container starts with a clean state. Second, when running Containers together in a Pod it is often necessary to share files between those Containers. The Kubernetes Volume abstraction solves both of these problems. [Read more](https://kubernetes.io/docs/concepts/storage/volumes/)

## Deployments
A Deployment provides declarative updates for Pods and ReplicaSets.

You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments. [Read more](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

## StatefulSets
StatefulSet is the workload API object used to manage stateful applications.

Manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.

Like a Deployment, a StatefulSet manages Pods that are based on an identical container spec. Unlike a Deployment, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same spec, but are not interchangeable: each has a persistent identifier that it maintains across any rescheduling. [Read More](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

## Minikube & Kubectl
### Minikube
minikube is local Kubernetes, focusing on making it easy to learn and develop for Kubernetes. 

Installing on macOS
`$ brew install hyperkit`
`$ brew install minikube`
(then link if necessary)

`$ minikube` to check if minikube working properly, then start minikube:

`$ minikube start --driver=hyperkit` 
`$ minikube start`// if you want to use docker as default driver
`$ minikube status` to know the status of minikube, it will print output like the following:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

All OS installation guideline:
[Install Minikube](https://v1-18.docs.kubernetes.io/docs/tasks/tools/install-minikube/) 

[Minikube Doc](https://minikube.sigs.k8s.io/docs/start/)

### kubectl
The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters. You can use kubectl to deploy applications, inspect and manage cluster resources, and view logs. 
 Run the following command to see the kubernetes client and server version.

`$ kubectl version`
```
Client Version: version.Info{Major:"1", Minor:"11", GitVersion:"v1.11.0", GitCommit:"91e7b4fd31fcd3d5f436da26c980becec37ceefe", GitTreeState:"clean", BuildDate:"2018-06-27T20:17:28Z", GoVersion:"go1.10.2", Compiler:"gc", Platform:"darwin/amd64"}
Server Version: version.Info{Major:"1", Minor:"19", GitVersion:"v1.19.2", GitCommit:"f5743093fd1c663cb0cbc89748f730662345d44d", GitTreeState:"clean", BuildDate:"2020-09-16T13:32:58Z", GoVersion:"go1.15", Compiler:"gc", Platform:"linux/amd64"}
```

[Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) 

[Kubectl handbook](https://minikube.sigs.k8s.io/docs/handbook/kubectl/)


## Create deployment

`$ kubectl get nodes` To get list of nodes

`$ kubectl get pods` To get list of pods

`$ kubectl get services`

Lets deploy a nginx image with name nginx-dep-name
`$ kubectl create deployment nginx-dep-name --image=nginx`

Get the deployment status
`$ kubectl get deployment`

If now we check pods, it will show 1 pod with name prefix 'nginx-dep-name'
`$ kubectl get pods`

## Pods debugging
`$ kubectl logs [pod_name]` It will show the pod logs

`$ kubectl describe pod [pod_name]` It will how you what state changes happened in the pod

To get the container terminal
`& kubectl exec -it [pod_name] -- bin/bash`

## Kubectl apply -f

We can create deployment with commandline as we did earlier `kubectl create deployment name --image=name option` etc. but you can do all this by craeting a configuration file and then tell kubectl to create a deployment based on the configured yaml file.

Lets create a deployment.yaml file to deploy nginx:
```
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    component: nginx
    tier: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      component: nginx
      tier: frontend
  template:
    metadata:
      labels:
        component: nginx
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
```
Lets deploy the newly created yaml file with 1 replica and nginx:alpine version

`$ kubectl apply -f nginx-deployment.yaml`

output: `deployment.apps/nginx created`

to check if the pod created:
`$ kubectl get pod`

Now lets update the yaml file to change the replica set to more than 1 and re-apply the same yaml file. Kubernetes can detect if this is newly created or updated, it changes accordingly.

`$ kubectl apply -f nginx-deployment.yaml`

output: `deployment.apps/nginx configured`

To check the available deployment, run the following command:

`$ kubectl get deployment`
```
NAME             READY     UP-TO-DATE   AVAILABLE   AGE
nginx            2/2       2            2           5m58s
nginx-dep-name   1/1       1            1           31m
```
We created nginx-dep-name from commandline directly and nginx with the yaml file.

## Deploy a app with database

`$ kubectl get all` This will print out all the services running

### Deploy a mongo 
Lets create an deployment file to delpoy mongo [check the mongo-deployment.yaml file]

### create Secret
```
apiVersion: v1    

kind: Secret
metadata:
      name: mongodb
      namespace: default
type: Opaque
data:
    username: 4oCYdXNlcm5hbWXigJk=
    password: 4oCYcGFzc3dvcmTigJk=

```

To create the base64 encoding in terminal, type the following:
`$ echo -n ‘usernameText’ | base64`

lets apply the secret.yaml file before we give refference in other deployment file:

`$ kubectl apply -f secret.yaml`

to check the secret has been created suffesscully:

`$ kubectl get secret`

Lets create deployment for mongodb
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb-deployment
  labels:
    app: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-username
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom: 
            secretKeyRef:
              name: mongodb-secret
              key: mongo-root-password

```

Now add the mondogb service in the same yaml file:

```
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  selector:
    app: mongodb
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017

```
And again run `$ kuebctl apply -f mongo-deployment.yaml`

## Deployment Service & Configmap

Lets create a configmap"
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongodb-configmap
data:
  database_url: mongodb-service
```

## kubectl command at a glance

kubectl apply commands in order
```
kubectl apply -f mongo-secret.yaml
kubectl apply -f mongo.yaml
kubectl apply -f mongo-configmap.yaml 
kubectl apply -f mongo-express.yaml
```
kubectl get commands
```
kubectl get pod
kubectl get pod --watch
kubectl get pod -o wide
kubectl get service
kubectl get secret
kubectl get all | grep mongodb
```
kubectl debugging commands
```
kubectl describe pod mongodb-deployment-xxxxxx
kubectl describe service mongodb-service
kubectl logs mongo-express-xxxxxx
```
give a URL to external service in minikube

`minikube service mongo-express-service`


