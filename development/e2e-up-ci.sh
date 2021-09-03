#!/usr/bin/env bash
# Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

set -e

RANDOM_PORT=$(LC_ALL=C tr -cd 0-9 </dev/urandom | head -c 3 ; echo)
LISTENING_PORT=$((RANDOM_PORT + 8000))
CLUSTER_ID=e2e-$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 8 ; echo)
CYPRESS_ID=cypress-$(LC_ALL=C tr -dc 'a-z0-9' </dev/urandom | head -c 8 ; echo)

function cleanup-kind {
  echo "Destroying the cluster ${CLUSTER_ID}"
  kind delete cluster --name "${CLUSTER_ID}"
    echo "Removing cypress image ${CYPRESS_ID}"
  docker rm -f "${CYPRESS_ID}" &> /dev/null
}

trap cleanup-kind EXIT

trap cleanup-kind ERR

kind create cluster --name "${CLUSTER_ID}" --config=./development/kind-config.yml --kubeconfig=./.kubeconfig

kind load --name "${CLUSTER_ID}" docker-image registry.sighup.io/poc/fury-application-status:latest

source ./development/.env-cluster-ci

export CYPRESS_BASE_URL="http://localhost:${LISTENING_PORT}"

make seed

git clone https://github.com/ztombol/bats-support ./scripts/e2e/libs/bats-support

git clone https://github.com/ztombol/bats-assert ./scripts/e2e/libs/bats-assert

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

bats -t ./scripts/e2e/tests.sh

echo "Scenario 1"

kubectl port-forward svc/fury-application-status-mocked "${LISTENING_PORT}":8080 --namespace fury-application-status &

docker run -i -e CYPRESS_BASE_URL -e CYPRESS_VIDEO -e DISPLAY= --entrypoint=bash -d --network host --name="${CYPRESS_ID}" cypress/included:8.3.0

docker cp $PWD/e2e-test "${CYPRESS_ID}":e2e

docker exec -i -w /e2e "${CYPRESS_ID}" 'yarn' 'add' '-D' '@testing-library/cypress'

docker exec -i -w /e2e "${CYPRESS_ID}" 'cypress' 'run' '--headless' '--spec' 'cypress/integration/fury-application-status-scenario-1_spec.js'

echo "Scenario 2"

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario2

pgrep kubectl | xargs kill -9

echo "Waiting for pods to be all ready"

kubectl wait --for=delete --timeout=60s -n fury-application-status pod --all

sleep 5

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

echo "Forwarding ports to pod"

kubectl port-forward svc/fury-application-status-mocked "${LISTENING_PORT}":8080 --namespace fury-application-status &

docker exec -i -w /e2e "${CYPRESS_ID}" 'cypress' 'run' '--headless' '--spec' 'cypress/integration/fury-application-status-scenario-2_spec.js'

echo "Scenario 3"

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario3

pgrep kubectl | xargs kill -9

echo "Waiting for pods to be all ready"

kubectl wait --for=delete --timeout=60s -n fury-application-status pod --all

sleep 5

kubectl wait --timeout=180s -n fury-application-status --for=condition=ready pod --all

echo "Forwarding ports to pod"

kubectl port-forward svc/fury-application-status-mocked "${LISTENING_PORT}":8080 --namespace fury-application-status &

docker exec -i -w /e2e "${CYPRESS_ID}" 'cypress' 'run' '--headless' '--spec' 'cypress/integration/fury-application-status-scenario-3_spec.js'
