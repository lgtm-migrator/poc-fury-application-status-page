#!/usr/bin/env bash
# Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

set -e

kind create cluster --config=./development/kind-config.yml --kubeconfig=./.kubeconfig

kind load docker-image registry.sighup.io/poc/fury-application-status:latest

source ./development/.env-cluster

make seed

sleep 5

make port-forward &

cd e2e-test && yarn install && yarn test --headless --spec cypress/integration/fury-application-status-scenario-1_spec.js

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario2

pgrep kubectl | xargs kill -9

make port-forward &

yarn test --headless --spec cypress/integration/fury-application-status-scenario-2_spec.js

kubectl set env -n fury-application-status deployment/fury-application-status-mocked FAKE_SCENARIO_ID=Scenario3

pgrep kubectl | xargs kill -9

make port-forward &

yarn test --headless --spec cypress/integration/fury-application-status-scenario-2_spec.js