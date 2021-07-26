/// <reference types="cypress" />
/// <reference types="@types/testing-library__cypress" />

it("E2E TEST - TARGETS PAGE - SCENARIO 2", function() {
    cy.visit("http://localhost:8000");

    cy.get(".target-status-text").should("have.text", "There's an issue with Ratings");
});
