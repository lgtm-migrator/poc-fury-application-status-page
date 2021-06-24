# [POC] Fury Application Status Page

This tool enables the view of the cluster health via easy to read WEB/UI.

### Deployment

To install/update the latest version in your hosts:

```bash
$ curl -s https://api.github.com/repos/sighupio/poc-fury-application-status-page/releases/latest | grep browser_download_url | grep linux | cut -d '"' -f 4 | xargs curl -Ls -o poc-fury-application-status-page
$ chmod +x poc-fury-application-status-page
$ sudo mv poc-fury-application-status-page /usr/local/bin/poc-fury-application-status-page
```

Then, don't forget to create a `config.yml` file:

```bash
$ cat config.yml
---
listener: 0.0.0.0:8080
externalEndpoint: http://externalUrl:externalPort
appEnv: 'development' || 'production'
```

### Run

```bash
$ poc-fury-application-status-page
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /config                   --> main.main.func1 (4 handlers)
[GIN-debug] GET    /                         --> main.main.func2 (4 handlers)
[GIN-debug] Listening and serving HTTP on 0.0.0.0:8080
```

## Building

The agent requires to be compiled using golang `1.16` as it embeds the static assets of the frontend application.

### Locally *(docker)*

You can build the `linux` *(amd64)* binary using `docker` by running:

```bash
$ make build
```

You will find the generated binary in the `./bin/linux/poc-fury-application-status-page` directory.

## License

For license details please see [LICENSE](LICENSE)
