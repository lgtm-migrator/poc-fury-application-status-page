#!/usr/bin/env bash
set -e

kind create cluster --config=./development/kind-config.yml --kubeconfig=./.kubeconfig

kind load docker-image registry.sighup.io/poc/fury-application-status:mocked

source ./development/.env-cluster

make seed

sleep 5

make port-forward &

cd e2e-test && yarn install && yarn test
