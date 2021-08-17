/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

/// <reference types="cypress" />
/// <reference types="@types/testing-library__cypress" />

describe("E2E TEST - SCENARIO 3", () => {
    const scenario = "Scenario3";

    it("TARGETS PAGE", function() {
        cy.visit(Cypress.env("BASE_URL"));
        cy.get(".target-status-text").should("have.text", "There's an issue with Ratings");
    });
})
