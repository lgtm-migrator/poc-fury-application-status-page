#!/usr/bin/env bash
# Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

set -e

CLUSTER_ID=e2e-$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 8 ; echo)

function cleanup {
  echo "Destroying the cluster ${CLUSTER_ID}"
  kind delete cluster --name "${CLUSTER_ID}"
}

make clean-ci

kind create cluster --name "${CLUSTER_ID}" --config=./development/kind-config.yml --kubeconfig=./.kubeconfig

trap cleanup EXIT

kind load docker-image registry.sighup.io/poc/fury-application-status:latest

source ./development/.env-cluster-ci

make seed

git clone https://github.com/ztombol/bats-support ./scripts/e2e/libs/bats-support

git clone https://github.com/ztombol/bats-assert ./scripts/e2e/libs/bats-assert

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

bats -t ./scripts/e2e/tests.sh

echo "Scenario 1"

make port-forward &

docker run -i -e CYPRESS_BASE_URL -e CYPRESS_VIDEO --entrypoint=bash -d --network host --name="cypress" cypress/included:8.3.0

docker cp $PWD/e2e-test cypress:e2e

docker exec -i -w /e2e cypress 'yarn' 'add' '-D' '@testing-library/cypress'

docker exec -i -w /e2e cypress 'cypress' 'run' '--headless' '--spec' 'cypress/integration/fury-application-status-scenario-1_spec.js'

echo "Scenario 2"

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario2

pgrep kubectl | xargs kill -9

echo "Waiting for pods to be all ready"

kubectl wait --for=delete --timeout=60s -n fury-application-status pod --all

sleep 5

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

echo "Forwarding ports to pod"

make port-forward &

docker exec -i -w /e2e cypress 'cypress' 'run' '--headless' '--spec' 'cypress/integration/fury-application-status-scenario-2_spec.js'

echo "Scenario 3"

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario3

pgrep kubectl | xargs kill -9

echo "Waiting for pods to be all ready"

kubectl wait --for=delete --timeout=60s -n fury-application-status pod --all

sleep 5

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

echo "Forwarding ports to pod"

make port-forward &

docker exec -i -w /e2e cypress 'cypress' 'run' '--headless' '--spec' 'cypress/integration/fury-application-status-scenario-3_spec.js'
