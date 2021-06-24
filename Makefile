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

## build: Generates the Linux binary from any system running docker
.PHONY: build
build: require-docker
	@mkdir -p bin/linux
	@docker build --no-cache --pull -t poc-fury-application-status-page:build .
	@docker create --name poc-fury-application-status-page-result --read-only poc-fury-application-status-page:build
	@docker cp poc-fury-application-status-page-result:/usr/local/bin/poc-fury-application-status-page bin/linux/poc-fury-application-status-page
	@docker rm poc-fury-application-status-page-result

## clean: Removes generated files
.PHONY: clean
clean: require-docker
	@docker rmi -f poc-fury-application-status-page:build
	@rm -rf .vagrant
	@rm -rf bin
