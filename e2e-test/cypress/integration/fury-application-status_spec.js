/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/// <reference types="cypress" />
/// <reference types="@types/testing-library__cypress" />

it("E2E TEST - TARGETS PAGE - SCENARIO 2", function() {
    cy.visit("http://localhost:8000");

    cy.get(".target-status-text").should("have.text", "There's an issue with Ratings");
});
