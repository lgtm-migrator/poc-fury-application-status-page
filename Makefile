.DEFAULT_GOAL := help
SHELL := /bin/bash

## help: (default) Prints the help message
.PHONY: help
help: Makefile
	@printf "\nChoose a command run in $(shell basename ${PWD}):\n"
	@sed -n 's/^##//p' $< | column -t -s ":" |  sed -e 's/^/ /'
	@echo

require-%:
	$(if $(shell command -v $* 2> /dev/null), , $(error Please install `$*` ***))

## dependencies: Install npm packages for the UI
.PHONY: dependencies
dependencies: require-yarn
	@yarn --cwd ./web-client install

## ui: Generates the UI static files
.PHONY: ui
ui: require-yarn
	@rm -rf ./static
	@yarn --cwd ./web-client build
	@cp -R ./web-client/build ./static

## docker-build: Build docker images
.PHONY: docker-build
docker-build: require-docker
	@docker build --target webapp --tag registry.sighup.io/poc/fury-application-status:webapp .
	@docker build --target compile --tag registry.sighup.io/poc/fury-application-status:backend .
	@docker build --cache-from registry.sighup.io/poc/fury-application-status:webapp --cache-from registry.sighup.io/poc/fury-application-status:backend --tag registry.sighup.io/poc/fury-application-status:latest .

## docker-release: Push docker images to the registry
.PHONY: docker-release
docker-release: require-docker docker-build
	@docker push registry.sighup.io/poc/fury-application-status:latest

## build: Generates the Linux binary from any system running docker
.PHONY: build
build: require-docker docker-build
	@mkdir -p bin/linux
	@docker create --name poc-fury-application-status-page-result --read-only registry.sighup.io/poc/fury-application-status:latest
	@docker cp poc-fury-application-status-page-result:/app/poc-fury-application-status-page bin/linux/poc-fury-application-status-page
	@docker rm poc-fury-application-status-page-result

## clean: Removes generated files
.PHONY: clean
clean: require-docker
	@docker rmi -f poc-fury-application-status-page:build
	@rm -rf .vagrant
	@rm -rf bin
