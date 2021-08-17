#!/usr/bin/env bats
# Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# Requires: bats-core https://github.com/bats-core/bats-core
# tests/bats-assert from https://github.com/bats-core/bats-assert.git\
# and tests/bats-support from https://github.com/bats-core/bats-support

load "libs/bats-support/load"
load "libs/bats-assert/load"

info() {
  echo -e "${BATS_TEST_NUMBER}: ${BATS_TEST_DESCRIPTION}" >&3
}

@test "Requirements" {
    info
    deploy() {
        kubectl run nginx --image=nginx --namespace=default
        kubectl wait --timeout=180s --for=condition=ready pod -l run=nginx --namespace=default
    }
    run deploy
    assert_success
}

@test "Get lastChecks" {
    info
    mutate() {
         get_api_call="fury-application-status-mocked.fury-application-status.svc.cluster.local:8080/api/v1/lastChecks"

         statusCode=$(kubectl exec -n default nginx -- curl -s -o /dev/null -w "%{http_code}" ${get_api_call})
         echo "$statusCode"
    }
    run mutate
    assert_output "200"
}

@test "Get lastChecksAndIssues " {
    info
    mutate() {
         get_api_call="fury-application-status-mocked.fury-application-status.svc.cluster.local:8080/api/v1/lastChecksAndIssues/Ratings"

         statusCode=$(kubectl exec -n default nginx -- curl -s -o /dev/null -w "%{http_code}" ${get_api_call})
         echo "$statusCode"
    }
    run mutate
    assert_output "200"
}

@test "Get lastFailedChecks " {
    info
    mutate() {
         get_api_call="fury-application-status-mocked.fury-application-status.svc.cluster.local:8080/api/v1/lastFailedChecks"

         statusCode=$(kubectl exec -n default nginx -- curl -s -o /dev/null -w "%{http_code}" ${get_api_call})
         echo "$statusCode"
    }
    run mutate
    assert_output "200"
}

@test "Get lastFailedChecks for day x" {
    info
    mutate() {
         get_api_call="fury-application-status-mocked.fury-application-status.svc.cluster.local:8080/api/v1/lastFailedChecks/day/2021-08-10"

         statusCode=$(kubectl exec -n default nginx -- curl -s -o /dev/null -w "%{http_code}" ${get_api_call})
         echo "$statusCode"
    }
    run mutate
    assert_output "200"
}
