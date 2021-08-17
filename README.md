# [POC] Fury Application Status Page

## Table of Contents

- [Fury Application Status Page](#fury-application-status-page)
    - [Table of Contents](#table-of-contents)
    - [Overview](#overview)
    - [Getting Started](#getting-started)
        - [Requirements](#requirements)
        - [Usage from inside a docker image](#usage-from-inside-a-docker-image)
        - [Deploy in a cluster as a Deployment](#deploy-in-a-cluster-as-a-deployment)
    - [Developer Guide](#developer-guide)
    - [License](#license)

## Overview

This tool enables the view of the cluster health via easy to read WEB/UI.

## Getting Started

To install/update the latest version in your hosts:

```bash
$ curl -s https://api.github.com/repos/sighupio/poc-fury-application-status-page/releases/latest | grep browser_download_url | cut -d '"' -f 4 | xargs curl -Ls -o poc-fury-application-status-page
$ chmod +x poc-fury-application-status-page
$ mv poc-fury-application-status-page /usr/local/bin/poc-fury-application-status-page
```

Then, don't forget to create a `config.yml` file:

```bash
$ cat config.yml
---
listener: 0.0.0.0:8080
externalEndpoint: http://externalUrl:externalPort
appEnv: 'development' || 'production'
apiUrl: http://fip-job-status-api-endpoint.example
groupLabel: string 
cascadeFailure: 0,1,2..
mocked: true || false
```

### Requirements

- Docker
- ...
- ...
- ...

### Usage from inside a docker image

There is a [Dockerfile bundled](./build/builder/Dockerfile) with this repo which
can be used to build a Docker image and that can be used to run the binary. To
build docker image one can use the make rule `build`.
To build the image:

```bash
$ make build
# The docker image will be created by the name poc-fury-application-status-page:latest
```

### Deploy in a cluster as a Deployment

TODO

## Developer Guide

To set the code up locally, build, run tests, etc. Please refer the [contributor's guide](./CONTRIBUTING.md).

## License

Check the [License here](./LICENSE)
