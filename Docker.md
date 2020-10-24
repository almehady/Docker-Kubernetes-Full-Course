# Docker Tutorial

## What is docker
Docker is a software platform that allows you to build, test, and deploy applications quickly. Docker packages software into standardized units called containers that have everything the software needs to run including libraries, system tools, code, and runtime. Using Docker, you can quickly deploy and scale applications into any environment and know your code will run.

## Install docker

[download docker desktop](https://www.docker.com/get-started) 

`$ docker ` // to get all the command available for docker
`$ docker —version` // check docker version

## Docker Image
Docker image is a template for creating and environment of your choice, i.e - database, app etc. and has everything we need to run our apps including OS, Software and of course our application code.

## Docker Container
Package Software into Standardized Units for Development, Shipment and Deployment. Container runs instance of of an docker image.
[Read more](https://www.docker.com/resources/what-container)

## Running Docker Images

[docker hub](hub.docker.com)

Let's run a nginx image
`$ docker pull nginx`
to check the running images, run the following command, it will display all the images with repository, tag, image id, created date and size information
`$ docker images`

## Running Docker Containers

to run a docker image:
`$ docker run nginx:latest`

run a docker image in detouched mode
`$ docker run -d nginx:latest`

to check all running containers, type:
`$ docker container ls`
Detached mode, shown by the option --detach or -d, means that a Docker container runs in the background of your terminal. It does not receive input or display output.

`$ docker run -d IMAGE`

To stop the container, type the following command:
`$ docker stop CONTAINER_ID`

## Exposing Docker Port
`$ docker run -d -p 8080:80 nginx:latest`

This will point the host port 8080 to container port 80

**Exposing multiple ports**
Add another port, this will map localhost:8080 to port 80 and also localhost:3000 to port 80, so with the both port you can access the container or app
`$ docker run -d -p 8080:80 -p 3000:80 nginx:latest`

Type the following command to see list of containers:
`$ docker ps`
Also you can run:
`$ docker ps --help` or 
To learn all the realted command of docker ps [click here](https://docs.docker.com/engine/reference/commandline/ps/)

## Managing Containers
Stop a docker container
`$ docker stop CONTAINER_ID/NAME`

To start the docker container again, run:
`$ docker start CONTAINER_ID/NAME`
To check all the container, run:
`$ docker ps -a`

To delete a container, run:
`$ docker rm CONTAINER_ID`

To delete all containers, run:
`$ docker rm $(docker ps -aq)`
Note: please keep in mind that if any container is running the above command will not work. So run the following command:
`$ docker rm -f $(docker ps -aq)`

## Naming Containers
If you do not specify any name to the container, it will be named automatically. To name of your container, run:

`$ docker run --name myapp -d -p 8080:80 -p 3000:80 nginx:latest`

To stop the container, run:
`$ docker stop myapp`
To start again the container, run:
`$ docker start myapp`

## Docker PS --Format
To list all running containers with their labels in a table format you can use:
`$ docker ps --format "table {{.ID}}\t{{.Labels}}\t{{.Names}}\t{{.Ports}}"`

Keep the formated variable as FORMAT
`$ export FORMAT ="{{.ID}}\t{{.Labels}}\t{{.Names}}\t{{.Ports}}"`

Now run the command
`$ docker ps --format=$FORMAT`

## Use Volumes (Host & Containers) 
Volumes allows sharing data, files & folders between host and container [or between containers]
[Read more about docker volumes](https://docs.docker.com/storage/volumes/)

`$ docker run --name myapp -v $(pwd):/usr/share/nginx/html -d -p 8080:80 nginx`

pwd = current directory, works dir in windows

`$ docker exec -it myapp bash`

this will give us an access to inside the container in interactive mode, here myapp is the running container.

## Use Volumes between Containers 
To get all the docker run help command, run:
`$ docker run --help`
scrool down and at -v section there is --volumes-from list

Now lets copy the content from myapp, run:
`$ docker run --name myapp-copy --volumes-from myapp -d -p 8081:80 nginx`

## Dockerfile
Docker can build images automatically by reading the instructions from a *Dockerfile*. A *Dockerfile* is a text document that contains all the commands a user could call on the command line to assemble an image. Using *docker build* users can create an automated build that executes several command-line instructions in succession.

[Read more about dockerfile](https://docs.docker.com/engine/reference/builder/)

Find the images, run:
`$ docker image ls`

### Create a Dockerfile
Sample Dockerfile (keep this file in root)

```
FROM nginx:latest
ADD . /usr/share/nginx/html
```
Another exampple to built NodeJS app
```
FROM node:latest
WORKDIR /app
ADD . .
RUN npm install
CMD node index.js
```
### Build a Dockerfile
`$ docker build --tag myapp:latest .`
here: myappp = name of the app, latest= tag/version of the app, . [dot] = Dockerfile location is current file

Now run our own image: `$ docker run -d -p 8080:80 myapp:latest`

### .Dockerfileignore

create a file inside your app as .dockerignore and include the files/folders that you want docker to ignore, same as .gitignore
```
node_modules
Dockerfile
.git
```

### Caching and Layers
we do not need to install dependencies if not required, so let's cahce it changing the Dockerfile as below:
```
FROM node:latest
WORKDIR /app
ADD package*.json .
RUN npm install
ADD . .
CMD node index.js
```

## Alpine

### Pulling alpine version
we can use alpine version of the images, i.e. `$ docker pull node:alpine` to pull the latest alpine version. Almost every popular repository has alpine version.

## Tags & Versions

Instead of using image:alpine lets use the version, so in future it can be change with our application requirements.

`FROM node:1.19.3-alpine`

### Tagging Override

`$ docker tag myapp-api:latest myapp-api:1`
This will create another image with tag 1 but both have the save funtionality.
