# CS497S Final Project: Wikitwinkie

Group Project for Fall 2022 COMPSCI 497S Scalable Web Systems @UMass Amherst

The course description can be found [here](https://github.com/scalable-web-systems/497s-F22).

The initial video description of the project can be found [here](https://youtu.be/U_VoATF9HHk).


### Team Overview

- Neil Gupta ([@nog642](https://github.com/nog642))
- Yichong Liu ([@YiChong_Liu](https://github.com/YiChong-Liu))
- Keith Pham ([@minhnghia2208](https://github.com/minhnghia2208))

### Tutorial

The project can be started using [docker](https://www.docker.com/).  Make sure download and open it beforehand,

To start this project, first run the command to build the docker image at the root of the directory:

```
docker compose build
```

Then run the command to start the project

```
docker compose up
```

When it's time to stop the project from running, run the command

```
docker compose down
```


### Microservices

- Article editing / edit history service **(Neil Gupta)**
- Article serving service **(Neil Gupta)**
- Session Management Service **(Neil Gupta)**

- Account management service **(Yichong Liu)**
- Image management service **(Yichong Liu)**
- Article Vote Service **(Yichong Liu)**

- Search engine service **(Keith Pham)**
- Comment service **(Keith Pham)**
- Comment vote service **(Keith Pham)**
